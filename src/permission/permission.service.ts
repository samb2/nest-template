import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { PageMetaDto } from '../utils/dto/page-meta.dto';
import { GetPermissionQueryDto, GetPermissionRes } from './dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async findAll(
    getPermissionDto: GetPermissionQueryDto,
  ): Promise<GetPermissionRes> {
    // Destructure query parameters
    const { sort, sortField, take, skip } = getPermissionDto;

    // Determine sorting parameters
    const orderField: string = sortField || 'id';
    const orderDirection: string = sort || 'ASC';

    // Retrieve permissions and total count from database
    const [permissions, itemCount] =
      await this.permissionRepository.findAndCount({
        skip,
        take,
        order: {
          [orderField]: orderDirection,
        },
      });

    // Create page metadata DTO
    const pageMeta: PageMetaDto = new PageMetaDto({
      metaData: getPermissionDto,
      itemCount,
    });

    return { permissions, pageMeta };
  }

  async findOne(id: string): Promise<Permission> {
    // Find permission by ID, selecting only necessary fields
    const permission: Permission = await this.permissionRepository.findOne({
      where: { id },
      select: {
        id: true,
        access: true,
      },
    });

    // If permission is not found, throw NotFoundException
    if (!permission) {
      throw new NotFoundException('Permission not found!');
    }
    return permission;
  }
}
