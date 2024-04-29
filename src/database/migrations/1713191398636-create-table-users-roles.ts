import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUsersRoles1713191398636 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS public.users_roles
        (
            id      uuid NOT NULL DEFAULT uuid_generate_v4(),
            role_id integer,
            user_id uuid,
            CONSTRAINT "PK_1d8dd7ffa37c3ab0c4eefb0b221" PRIMARY KEY (id),
            CONSTRAINT "UQ_c525e9373d63035b9919e578a9c" UNIQUE (role_id, user_id),
            CONSTRAINT "FK_1cf664021f00b9cc1ff95e17de4" FOREIGN KEY (role_id)
                REFERENCES public.roles (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE,
            CONSTRAINT "FK_e4435209df12bc1f001e5360174" FOREIGN KEY (user_id)
                REFERENCES public.users (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS public.users_roles`);
  }
}
