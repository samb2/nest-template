import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Not, QueryRunner, Repository } from 'typeorm';
import { Permission } from '../permission/entities/permission.entity';
import { createTransaction } from '../utils/create-transaction.util';
import { Role, RolePermission } from './entities';
import { User, UsersRoles } from '../auth/entities';
import {
  CreateRoleDto,
  DeleteRoleResDto,
  DeleteRoleUserResDto,
  GetAllRoleResDto,
  GetRoleQueryDto,
  UpdateRoleDto,
} from './dto';
import { RedisService } from '../redis';
import { PermissionEnum } from '../common/enums';
import { PageMetaDto } from '../common/dto/page-meta.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UsersRoles)
    private readonly usersRolesRepository: Repository<UsersRoles>,
    @Inject(RedisService)
    private readonly redisService: RedisService,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    // Create Transaction
    const queryRunner: QueryRunner = await createTransaction(this.dataSource);

    // Get Repositories
    const roleRep: Repository<Role> = queryRunner.manager.getRepository(Role);
    const permissionRep: Repository<Permission> =
      queryRunner.manager.getRepository(Permission);
    const rolePermissionRep: Repository<RolePermission> =
      queryRunner.manager.getRepository(RolePermission);

    try {
      // Check if the role already exists
      const existingRole: Role = await roleRep.findOne({
        where: { name: createRoleDto.name },
        select: { id: true },
      });
      if (existingRole) {
        throw new ConflictException('Role already exists!');
      }

      // Create the new role
      const role: Role = roleRep.create({
        name: createRoleDto.name,
        description: createRoleDto.description,
      });
      await roleRep.save(role);

      // If permissions are provided, associate them with the role
      if (
        createRoleDto.permissionIds &&
        createRoleDto.permissionIds.length > 0
      ) {
        // Check for duplicated permission IDs
        this._checkDuplicatesPermissionsIds(createRoleDto.permissionIds);

        // Fetch and associate permissions in parallel
        const permissions: Permission[] =
          await this._fetchAndValidatePermissions(
            createRoleDto.permissionIds,
            permissionRep,
          );

        // Create role permissions associations
        const rolePermissions: RolePermission[] = permissions.map(
          (permission) => {
            return rolePermissionRep.create({
              role: { id: role.id },
              permission: { id: permission.id },
            });
          },
        );
        await rolePermissionRep.save(rolePermissions);

        // Save role permissions to Redis Common
        const redisPermissions: PermissionEnum[] = permissions.map(
          (permission) => permission.access,
        );

        const key: string = this.redisService.generateRoleKey(
          role.id.toString(),
        );
        await this.redisService.set(key, JSON.stringify(redisPermissions));
      }

      // Commit the transaction
      await queryRunner.commitTransaction();
      return role;
    } catch (e) {
      // Rollback the transaction in case of an error
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  async findAll(getRoleDto: GetRoleQueryDto): Promise<GetAllRoleResDto> {
    const { sort, sortField, take, skip } = getRoleDto;

    // Determine sorting parameters
    const orderField: string = sortField || 'id';
    const orderDirection: string = sort || 'ASC';

    // Fetch roles and total count
    const [roles, itemCount] = await this.roleRepository.findAndCount({
      where: {
        name: Not('super admin'),
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
      skip,
      take,
      order: {
        [orderField]: orderDirection,
      },
    });

    // Create page metadata
    const pageMeta: PageMetaDto = new PageMetaDto({
      metaData: getRoleDto,
      itemCount,
    });

    return { roles, pageMeta };
  }

  async findOne(id: number): Promise<Role> {
    const role: Role = await this.roleRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        rolePermissions: {
          id: true,
          permission: {
            id: true,
            access: true,
          },
        },
      },
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });

    // Role Not Found
    if (!role) {
      throw new NotFoundException(`Role not found!`);
    }

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    // Start a transaction
    const queryRunner: QueryRunner = await createTransaction(this.dataSource);

    // Get Repositories
    const roleRep: Repository<Role> = queryRunner.manager.getRepository(Role);
    const permissionRep: Repository<Permission> =
      queryRunner.manager.getRepository(Permission);
    const rolePermissionRep: Repository<RolePermission> =
      queryRunner.manager.getRepository(RolePermission);

    try {
      // Find the role to update
      const role: Role = await roleRep.findOne({
        where: { id },
      });

      // If role not found, throw NotFoundException
      if (!role) {
        throw new NotFoundException(`Role not found.`);
      }

      // Destructure updateRoleDto
      const { name, description, permissionIds } = updateRoleDto;

      if (name) {
        // Check if role name already exists
        const existingRole: Role = await roleRep.findOne({
          where: { name, id: Not(id) },
          select: { id: true },
        });
        if (existingRole) {
          throw new ConflictException('Role Name already Exist');
        }

        // Update role name
        role.name = name;
      }

      // Update role description
      role.description = description ?? role.description;

      // If permissionIds provided, update role permissions
      if (permissionIds && permissionIds.length > 0) {
        // Remove existing role permissions
        await rolePermissionRep.delete({ role: { id } });
        const key: string = this.redisService.generateRoleKey(
          role.id.toString(),
        );
        await this.redisService.delete(key);

        // Find duplicates in the rolePermissions array
        this._checkDuplicatesPermissionsIds(permissionIds);

        // Fetch permissions and check for missing ones
        const permissions: Permission[] =
          await this._fetchAndValidatePermissions(permissionIds, permissionRep);

        // Create new RolePermission associations
        role.rolePermissions = permissions.map((permission) => {
          return rolePermissionRep.create({
            //role: { id: role.id },
            permission,
          });
        });

        const redisPermissions: PermissionEnum[] = permissions.map(
          (permission) => permission.access,
        );

        await this.redisService.set(key, JSON.stringify(redisPermissions));
      }

      await roleRep.save(role);

      // Commit the transaction
      await queryRunner.commitTransaction();
      return role;
    } catch (e) {
      // Rollback the transaction in case of an error
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  async remove(id: number): Promise<DeleteRoleResDto> {
    // Start a transaction
    const queryRunner: QueryRunner = await createTransaction(this.dataSource);

    // Get the Role repository
    const roleRep: Repository<Role> = queryRunner.manager.getRepository(Role);

    try {
      const role: Role = await roleRep.findOne({
        where: { id },
        select: { id: true, name: true },
      });

      // If role not found, throw NotFoundException
      if (!role) {
        throw new NotFoundException(`Role not found.`);
      }

      // Delete the role
      await roleRep.delete({ id });

      // Delete role from Redis Common
      const key: string = this.redisService.generateRoleKey(role.id.toString());
      await this.redisService.delete(key);

      // Commit the transaction
      await queryRunner.commitTransaction();
      // Return success message
      return { message: `Role deleted successfully` };
    } catch (e) {
      // Rollback the transaction in case of an error
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  async getUserRoles(userId: string): Promise<User> {
    // Find the user by their ID along with their roles
    const user: User = await this.userRepository.findOne({
      where: { id: userId },
      select: {
        id: true,
        isActive: true,
        isDelete: true,
        userRoles: { id: true, role: { id: true, name: true } },
      },
      relations: ['userRoles', 'userRoles.role'],
    });

    // If user not found, throw NotFoundException
    if (!user) {
      throw new NotFoundException('user not found!');
    }
    // Return the found user
    return user;
  }

  async assignRoleToUser(id: number, userId: string): Promise<UsersRoles> {
    // Find the role by its ID
    const role: Role = await this.roleRepository.findOne({
      where: { id },
      select: { id: true, name: true },
    });

    // If role not found, throw NotFoundException
    if (!role) {
      throw new NotFoundException('role not found!');
    }

    // Find the user by their ID
    const user: User = await this.userRepository.findOne({
      where: { id: userId, isDelete: false },
      select: {
        id: true,
      },
    });

    // If user not found, throw NotFoundException
    if (!user) {
      throw new NotFoundException('user not found!');
    }

    // Check if the role is already assigned to the user
    const usersRolesExist: UsersRoles = await this.usersRolesRepository.findOne(
      {
        where: {
          role,
          user,
        },
        select: {
          id: true,
        },
      },
    );

    // If role is already assigned to the user, throw ConflictException
    if (usersRolesExist) {
      throw new ConflictException('this role already assigned to this user!');
    }

    // Create new UsersRoles association
    const usersRoles: UsersRoles = this.usersRolesRepository.create({
      role,
      user,
    });
    // Save the association
    await this.usersRolesRepository.save(usersRoles);

    return usersRoles;
  }

  async deleteUserRole(
    id: number,
    userId: string,
  ): Promise<DeleteRoleUserResDto> {
    // Find the role by its ID
    const role: Role = await this.roleRepository.findOne({
      where: { id },
      select: { id: true, name: true },
    });

    // If role not found, throw NotFoundException
    if (!role) {
      throw new NotFoundException('role not found!');
    }

    // Find the user by their ID
    const user: User = await this.userRepository.findOne({
      where: { id: userId, isDelete: false },
      select: {
        id: true,
        email: true,
      },
    });

    // If user not found, throw NotFoundException
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    // Check if the role is assigned to the user
    const usersRolesExist: UsersRoles = await this.usersRolesRepository.findOne(
      {
        where: {
          role,
          user,
        },
        select: { id: true },
      },
    );

    // If role not assigned to the user, throw NotFoundException
    if (!usersRolesExist) {
      throw new NotFoundException('This role not assigned to this user!');
    }

    // Remove the role from the user
    await this.usersRolesRepository.remove(usersRolesExist);

    // Return success message
    return {
      message: `This action removes a #${role.name} role from ${user.email}`,
    };
  }

  private _checkDuplicatesPermissionsIds(permissionIds: string[]) {
    // Check for duplicated permission IDs
    const permissionIdsSet: Set<string> = new Set(permissionIds);
    if (permissionIdsSet.size !== permissionIds.length) {
      throw new BadRequestException('Duplicated permission IDs found.');
    }
  }

  private async _fetchAndValidatePermissions(
    permissionIds: string[],
    permissionRep: Repository<Permission>,
  ): Promise<Permission[]> {
    // Fetch permissions and check for missing ones
    const permissions: Permission[] = await permissionRep.find({
      select: { id: true, access: true },
      where: {
        id: In(permissionIds),
      },
    });

    const notFoundPermissions: string[] = permissionIds.filter(
      (id) => !permissions.some((permission) => permission.id === id),
    );

    if (notFoundPermissions.length > 0) {
      throw new NotFoundException(
        `Permissions with IDs ${notFoundPermissions.join(', ')} not found.`,
      );
    }

    return permissions;
  }
}
