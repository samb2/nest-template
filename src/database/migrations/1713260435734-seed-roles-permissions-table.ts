import { MigrationInterface, QueryRunner, Repository } from 'typeorm';
import { RoleEnum } from '../../role/enum/role.enum';
import { Permission } from '../../permission/entities/permission.entity';
import { Role, RolePermission } from '../../role/entities';
import { redis } from '../redis.module';
import { PermissionEnum } from '../../common/enums';
import { RedisKeyEnum } from '../../redis';

export class SeedRolesPermissionsTable1713260435734
  implements MigrationInterface
{
  redisClient: any;

  constructor() {
    const { useFactory } = redis;
    this.redisClient = useFactory();
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.startTransaction();
    // Get Repositories
    const roleRep: Repository<Role> = queryRunner.manager.getRepository(Role);
    const permissionRep: Repository<Permission> =
      queryRunner.manager.getRepository(Permission);
    const rolePermissionRep: Repository<RolePermission> =
      queryRunner.manager.getRepository(RolePermission);

    try {
      const rolePermissions: RolePermission[] = [];
      const redisAdminPermissions: any[] = [];
      const redisUserPermissions: any[] = [];
      let redisAdminKey: string;
      let redisUserKey: string;
      let redisSuperAdminKey: string;

      // Get Roles
      const roles: Role[] = await roleRep.find({
        select: {
          id: true,
          name: true,
        },
      });
      // ---------------
      // Get Permissions

      const permissions: Permission[] = await permissionRep.find({
        select: {
          id: true,
          access: true,
        },
      });
      // ---------------

      for (const role of roles) {
        // Super admin
        if (role.name === RoleEnum.SUPER_ADMIN) {
          redisSuperAdminKey = `${RedisKeyEnum.ROLE}-${role.id.toString()}`;
        }
        // Admin
        if (role.name === RoleEnum.ADMIN) {
          redisAdminKey = `${RedisKeyEnum.ROLE}-${role.id.toString()}`;
          for (const permission of permissions) {
            if (
              PermissionEnum.MANAGE_ROLE === (permission.access as string) ||
              PermissionEnum.MANAGE_USER === (permission.access as string) ||
              PermissionEnum.MANAGE_FILE === (permission.access as string) ||
              PermissionEnum.MANAGE_PERMISSION ===
                (permission.access as string) ||
              PermissionEnum.MANAGE_PROFILE === (permission.access as string) ||
              PermissionEnum.MANAGE_AVATAR === (permission.access as string)
            ) {
              rolePermissions.push(
                rolePermissionRep.create({ role, permission }),
              );
              redisAdminPermissions.push(permission.access);
            }
          }
        }
        // User
        if (role.name === RoleEnum.USER) {
          redisUserKey = `${RedisKeyEnum.ROLE}-${role.id.toString()}`;
          for (const permission of permissions) {
            if (
              PermissionEnum.MANAGE_AVATAR === (permission.access as string) ||
              PermissionEnum.MANAGE_PROFILE === (permission.access as string)
            ) {
              rolePermissions.push(
                rolePermissionRep.create({ role, permission }),
              );
              redisUserPermissions.push(permission.access);
            }
          }
        }
      }
      await rolePermissionRep.save(rolePermissions);
      // Redis
      await this.redisClient.set(redisSuperAdminKey, JSON.stringify([]));
      await this.redisClient.set(
        redisAdminKey,
        JSON.stringify(redisAdminPermissions),
      );
      await this.redisClient.set(
        redisUserKey,
        JSON.stringify(redisUserPermissions),
      );
      await queryRunner.commitTransaction();
    } catch (e) {
      // Rollback the transaction if there's an error
      await queryRunner.rollbackTransaction();
      throw e;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const rolePermissionRep: Repository<RolePermission> =
      queryRunner.manager.getRepository(RolePermission);
    await rolePermissionRep.clear();
    // Redis
    await this.redisClient.flushall();
  }
}
