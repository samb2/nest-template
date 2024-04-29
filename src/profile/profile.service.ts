import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { createTransaction } from '../utils/create-transaction.util';
import * as process from 'node:process';
import {
  DeleteAvatarResDto,
  UpdatePasswordDto,
  UpdatePasswordResDto,
  UpdateProfileDto,
  UpdateProfileResDto,
} from './dto';
import { User } from '../auth/entities';
import { bcryptPassword, comparePassword } from '../utils/password.util';

@Injectable()
export class ProfileService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(user: User): Promise<User> {
    return {
      id: user.id,
      email: user.email,
      avatar: user.avatar
        ? `${process.env.MINIO_STORAGE_URL}${user.avatar}`
        : null,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
    } as User;
  }

  async update(
    updateProfileDto: UpdateProfileDto,
    user: User,
  ): Promise<UpdateProfileResDto> {
    // Destructure the fields from the DTO
    let { firstName, lastName } = updateProfileDto;

    // If firstName or lastName is not provided in the DTO, use the existing values from the user entity
    firstName = firstName ? firstName : user.firstName;
    lastName = lastName ? lastName : user.lastName;

    // Update the user's profile in the database
    await this.userRepository.update(
      { id: user.id },
      {
        firstName,
        lastName,
      },
    );

    // Return a success message
    return { message: `profile update successfully` };
  }

  async updatePassword(
    updateProfileDto: UpdatePasswordDto,
    user: User,
  ): Promise<UpdatePasswordResDto> {
    const userPassword: User = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
      select: {
        password: true,
      },
    });

    // Compare the old password with the stored password
    const compare: boolean = await comparePassword(
      updateProfileDto.oldPassword,
      userPassword.password,
    );

    // If old password is incorrect, throw an error
    if (!compare) {
      throw new BadRequestException('Your old password is incorrect');
    }

    // Hash and update the new password
    user.password = await bcryptPassword(updateProfileDto.newPassword);

    // Save the updated user entity
    await this.userRepository.save(user);
    // Return success message
    return { message: `Password update successfully` };
  }

  async deleteAvatar(id: string, avatar: string): Promise<DeleteAvatarResDto> {
    // Create Transaction
    const queryRunner: QueryRunner = await createTransaction(this.dataSource);

    // Get Repositories
    const userRep: Repository<User> = queryRunner.manager.getRepository(User);

    try {
      // If the avatar path is not provided, throw NotFoundException
      if (!avatar) {
        throw new NotFoundException('avatar not found');
      }

      // Update the user's avatar to null in the database
      await userRep.update({ id }, { avatar: null });

      // Commit the transaction
      await queryRunner.commitTransaction();

      // Return success message
      return { message: 'Avatar deleted successfully' };
    } catch (e) {
      // Rollback the transaction in case of an error
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }
}
