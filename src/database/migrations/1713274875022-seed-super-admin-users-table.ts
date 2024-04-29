import { MigrationInterface, QueryRunner, Repository } from 'typeorm';
import { bcryptPassword } from '../../utils/password.util';
import { RoleEnum } from '../../role/enum/role.enum';
import { User, UsersRoles } from '../../auth/entities';
import { Role } from '../../role/entities';

export class SeedSuperAdminUsersTable1713274875022
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.startTransaction();
    // Get Repositories
    const userRolesRep: Repository<UsersRoles> =
      queryRunner.manager.getRepository(UsersRoles);
    const rolesRep: Repository<Role> = queryRunner.manager.getRepository(Role);
    const userRep: Repository<User> = queryRunner.manager.getRepository(User);
    try {
      //------------------
      // Create Super Admin
      const user: User = userRep.create({
        email: 'super@admin.com',
        password: await bcryptPassword('12345678'),
        admin: true,
        superAdmin: true,
      });
      await queryRunner.manager.getRepository(User).save(user);
      // Find Super Admin Role
      const role: Role = await rolesRep.findOne({
        where: {
          name: RoleEnum.SUPER_ADMIN,
        },
        select: {
          id: true,
        },
      });
      // Create User Roles
      const userRoles: UsersRoles = userRolesRep.create({ role, user });
      await userRolesRep.save(userRoles);
      // Commit the transaction if everything is successful
      await queryRunner.commitTransaction();
    } catch (e) {
      // Rollback the transaction if there's an error
      await queryRunner.rollbackTransaction();
      throw e;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const userRep: Repository<User> = queryRunner.manager.getRepository(User);
    await userRep.delete({ email: 'super@admin.com' });
  }
}
