import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';
import * as path from 'path';
import { MinioService } from '../minio/minio.service';
import { BucketEnum } from '../minio/enum/bucket.enum';
import { DeleteFileResDto, GetFilesQueryDto } from './dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { createTransaction } from '../utils/create-transaction.util';
import { User } from '../auth/entities';
import { PageMetaDto } from '../common/dto/page-meta.dto';

@Injectable()
export class FileService {
  constructor(
    @Inject(MinioService) private readonly minioService: MinioService,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async uploadAvatar(image: any, user: User): Promise<File> {
    // Generate metadata for the file
    const metaData: object = {
      'content-type': image.mimetype,
    };

    // Set Bucket Name
    const bucketName: BucketEnum = BucketEnum.AVATAR;

    // Extract file extension and generate filename
    const extension: string = path.parse(image.originalname).ext;
    const filename: string = `${uuidV4()}`;
    const bucketKey: string = `${filename}${extension}`;

    // Start a database transaction
    const queryRunner: QueryRunner = await createTransaction(this.dataSource);

    try {
      // Find the bucket for avatar files
      const bucket: boolean = await this.minioService.bucketExists(bucketName);

      // If bucket is not found, throw an error
      if (!bucket) {
        throw new NotFoundException(`Bucket ${bucketName} not found`);
      }

      // Get repositories for user and file entities
      const userRep: Repository<User> = queryRunner.manager.getRepository(User);
      const fileRep: Repository<File> = queryRunner.manager.getRepository(File);

      // Save file metadata to the database
      const file: File = fileRep.create({
        name: image.originalname,
        key: bucketKey,
        bucket: bucketName,
        size: image.size,
        mimeType: image.mimetype,
        uploadedBy: user.id,
        path: `${bucketName}/${bucketKey}`,
      });
      await fileRep.save(file);

      // If there's a request to delete the old avatar, remove it from Minio and delete its metadata from the database
      if (user.avatar) {
        const key = user.avatar.replace(`${bucketName}/`, '');
        await this.minioService.removeObject(bucketName, key);
        await fileRep.delete({ key });
      }

      // Save user avatar
      user.avatar = file.path;
      await userRep.save(user);

      // Save file to Minio storage
      await this.minioService.insertFile(
        bucketName,
        bucketKey,
        image.buffer,
        metaData,
      );

      // Commit the transaction
      await queryRunner.commitTransaction();

      // Return the uploaded file entity
      return file;
    } catch (e) {
      // If an error occurs, rollback the transaction and throw the error
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  async findAll(getFileDto: GetFilesQueryDto) {
    // Destructure query parameters
    const { sortField, sort, take, skip } = getFileDto;

    // Determine the sorting order and field
    const orderField: string = sortField || 'createdAt';
    const orderDirection: string = sort || 'ASC';

    // Retrieve files and total count based on provided criteria
    const [files, itemCount] = await this.fileRepository.findAndCount({
      where: {},
      select: {
        id: true,
        key: true,
        path: true,
        name: true,
        bucket: true,
        createdAt: true,
        uploadedBy: true,
        size: true,
        mimeType: true,
      },
      skip,
      take,
      order: {
        [orderField]: orderDirection,
      },
    });

    // Generate pagination metadata
    const pageMeta: PageMetaDto = new PageMetaDto({
      metaData: getFileDto,
      itemCount,
    });

    return { files, pageMeta };
  }

  async findOne(id: string): Promise<File> {
    const file: File = await this.fileRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        key: true,
        path: true,
        bucket: true,
        uploadedBy: true,
      },
    });
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return file;
  }

  async remove(id: string): Promise<DeleteFileResDto> {
    // Start a database transaction
    const queryRunner: QueryRunner = await createTransaction(this.dataSource);

    try {
      // Get repositories for user and file entities
      const fileRep: Repository<File> = queryRunner.manager.getRepository(File);
      const userRep: Repository<User> = queryRunner.manager.getRepository(User);
      // Find the file by ID
      const file: File = await this.findOne(id);

      // Get the bucket name associated with the file
      const bucketName = file.bucket;

      // Delete the file from the repository
      await fileRep.delete({ id });

      // If the file was from the avatar bucket, send a message to the user service
      if (bucketName === BucketEnum.AVATAR) {
        await userRep.update(
          {
            id: file.uploadedBy,
          },
          {
            avatar: null,
          },
        );
      }
      // Remove the file from Minio storage
      await this.minioService.removeObject(bucketName, file.key);

      // Commit the transaction
      await queryRunner.commitTransaction();

      // Return success message
      return { message: `This action removes a #${id} file` };
    } catch (e) {
      // If an error occurs, rollback the transaction and throw the error
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }
}
