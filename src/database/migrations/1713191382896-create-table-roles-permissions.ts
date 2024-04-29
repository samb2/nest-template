import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableRolesPermissions1713191382896
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS public.roles_permissions
        (
            id            uuid NOT NULL DEFAULT uuid_generate_v4(),
            role_id       integer,
            permission_id uuid,
            CONSTRAINT "PK_298f2c0e2ea45289aa0c4ac8a02" PRIMARY KEY (id),
            CONSTRAINT "UQ_0cd11f0b35c4d348c6ebb9b36b7" UNIQUE (role_id, permission_id),
            CONSTRAINT "FK_337aa8dba227a1fe6b73998307b" FOREIGN KEY (permission_id)
                REFERENCES public.permissions (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE,
            CONSTRAINT "FK_7d2dad9f14eddeb09c256fea719" FOREIGN KEY (role_id)
                REFERENCES public.roles (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS public.roles_permissions`);
  }
}
