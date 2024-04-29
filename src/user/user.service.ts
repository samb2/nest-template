import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  GetAllUsersResDto,
  GetUsersQueryDto,
  UpdateUserDto,
  UpdateUserResDto,
} from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities';
import { Repository } from 'typeorm';
import { PageMetaDto } from '../common/dto/page-meta.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(
    getUsersQueryDto?: GetUsersQueryDto,
  ): Promise<GetAllUsersResDto> {
    // Destructure query parameters or set default values if not provided
    const { is_active, admin, is_delete, sort, sortField, take, skip } =
      getUsersQueryDto;

    // Initialize whereConditions object to build the WHERE clause for filtering
    const whereConditions: any = {
      ...(is_delete !== undefined ? { isDelete: is_delete } : {}),
      ...(is_active !== undefined ? { isActive: is_active } : {}),
      ...(admin !== undefined ? { admin: admin } : {}),
    };

    // Determine the sorting order and field
    const orderField: string = sortField || 'createdAt';
    const orderDirection: string = sort || 'ASC';

    // Retrieve users and total count based on provided criteria
    const [users, itemCount] = await this.userRepository.findAndCount({
      where: whereConditions,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        avatar: true,
        email: true,
        isActive: true,
        isDelete: true,
        admin: true,
      },
      skip,
      take,
      order: {
        [orderField]: orderDirection,
      },
    });

    // Generate pagination metadata
    const pageMeta: PageMetaDto = new PageMetaDto({
      metaData: getUsersQueryDto,
      itemCount,
    });

    return { users, pageMeta };
  }

  async findOne(id: string): Promise<User> {
    // Find the user by ID
    const user: User = await this.userRepository.findOne({
      where: {
        id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        avatar: true,
        email: true,
        isActive: true,
        isDelete: true,
        admin: true,
      },
    });

    // If user is not found, throw NotFoundException
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    // Return the retrieved user
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserResDto> {
    // Find the user by ID
    const user: User = await this.userRepository.findOne({
      where: {
        id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        isDelete: true,
        isActive: true,
        admin: true,
      },
    });

    // If user is not found, throw NotFoundException
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    // Update user properties with the values from the DTO
    Object.assign(user, updateUserDto);

    // Save the updated user entity
    await this.userRepository.save(user);

    // Return success message
    return { message: 'The user has been successfully updated.' };
  }

  public async validateUserById(id: string): Promise<User | undefined> {
    try {
      return this.userRepository.findOne({
        where: { id, isDelete: false, isActive: true },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
          superAdmin: true,
          isActive: true,
          email: true,
          isDelete: true,
          createdAt: true,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
