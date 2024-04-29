import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTablePermissions1713191345664 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TYPE public.permissions_access_enum AS ENUM
    ('manage_user', 'create_user', 'read_user', 'update_user', 'delete_user', 'manage_file', 'create_file', 'read_file', 'update_file', 'delete_file', 'manage_bucket', 'create_bucket', 'read_bucket', 'update_bucket', 'delete_bucket', 'manage_role', 'create_role', 'read_role', 'update_role', 'delete_role', 'manage_permission', 'create_permission', 'read_permission', 'update_permission', 'delete_permission', 'manage_profile', 'read_profile', 'update_profile', 'manage_avatar', 'create_avatar', 'delete_avatar');`);

    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS public.permissions
        (
            id     uuid                    NOT NULL DEFAULT uuid_generate_v4(),
            access permissions_access_enum NOT NULL,
            CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY (id)
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS public.permissions`);
  }
}
