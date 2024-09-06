import { Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { ConfigService } from '@nestjs/config';
import { BucketEnum } from './enum/bucket.enum';
import * as stream from 'node:stream';
import type { ItemBucketMetadata } from 'minio/src/internal/type';

@Injectable()
export class MinioService {
  public minioService: Client;

  constructor(private readonly configService: ConfigService) {
    this.minioService = new Client({
      endPoint: this.configService.get('minio.endPoint'),
      port: parseInt(this.configService.get('minio.port')),
      useSSL: this.configService.get<boolean>('minio.useSSL'),
      accessKey: this.configService.get('minio.accessKey'),
      secretKey: this.configService.get('minio.secretKey'),
    });
  }

  async insertFile(
    bucketName: BucketEnum,
    buketKey: string,
    file: stream.Readable | Buffer | string,
    size: number,
    metaData?: ItemBucketMetadata,
  ): Promise<void> {
    try {
      await this.minioService.putObject(
        bucketName,
        buketKey,
        file,
        size,
        metaData,
      );
    } catch (e) {
      throw e;
    }
  }

  async findAll(): Promise<BucketEnum[]> {
    return Object.values(BucketEnum);
  }

  async listBuckets(): Promise<any[]> {
    return this.minioService.listBuckets();
  }

  async removeObject(bucketName: string, bucketKey: string): Promise<any> {
    await this.minioService.removeObject(
      bucketName, // bucket name
      bucketKey, // object name
    );
  }

  async createBucketIfNotExist(bucketName: BucketEnum): Promise<boolean> {
    const bucketExist: boolean =
      await this.minioService.bucketExists(bucketName);
    if (bucketExist) {
      return bucketExist;
    }
    if (!bucketExist) {
      await this.minioService.makeBucket(bucketName);
      return true;
    }
  }

  async bucketExists(bucketName: BucketEnum): Promise<boolean> {
    return this.minioService.bucketExists(bucketName);
  }
}
