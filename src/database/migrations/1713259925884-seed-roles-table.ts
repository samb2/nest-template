import { MigrationInterface, QueryRunner, Repository } from 'typeorm';
import { RoleEnum } from '../../role/enum/role.enum';
import { Role } from '../../role/entities';

export class SeedRolesTable1713259925884 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    //Get Repositories
    const roleRepository: Repository<Role> =
      queryRunner.manager.getRepository(Role);
    const roles: Role[] = [];

    // Save Roles & Permissions
    for (const roleEnumKey in RoleEnum) {
      roles.push(roleRepository.create({ name: RoleEnum[roleEnumKey] }));
    }
    await roleRepository.save(roles);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const roleRepository: Repository<Role> =
      queryRunner.manager.getRepository(Role);
    await roleRepository.clear();
  }
}
