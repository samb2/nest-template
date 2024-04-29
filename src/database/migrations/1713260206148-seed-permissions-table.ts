import { MigrationInterface, QueryRunner, Repository } from 'typeorm';
import { Permission } from '../../permission/entities/permission.entity';
import { PermissionEnum } from '../../common/enums';

export class SeedPermissionsTable1713260206148 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const permissionRep: Repository<Permission> =
      queryRunner.manager.getRepository(Permission);

    const permissions: Permission[] = [];

    for (const permissionEnumKey in PermissionEnum) {
      permissions.push(
        permissionRep.create({
          access: PermissionEnum[permissionEnumKey],
        }),
      );
    }
    await permissionRep.save(permissions);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const permissionRep: Repository<Permission> =
      queryRunner.manager.getRepository(Permission);
    await permissionRep.clear();
  }
}
