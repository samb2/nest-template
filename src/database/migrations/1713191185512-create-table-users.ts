import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUsers1713191185512 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS public.users
        (
            id          uuid                                           NOT NULL DEFAULT uuid_generate_v4(),
            email       character varying COLLATE pg_catalog."default" NOT NULL,
            password    character varying COLLATE pg_catalog."default" NOT NULL,
            avatar      character varying COLLATE pg_catalog."default",
            first_name  character varying COLLATE pg_catalog."default",
            last_name   character varying COLLATE pg_catalog."default",
            is_active   boolean                                        NOT NULL DEFAULT true,
            is_delete   boolean                                        NOT NULL DEFAULT false,
            super_admin boolean                                        NOT NULL DEFAULT false,
            admin       boolean                                        NOT NULL DEFAULT false,
            created_at  timestamp without time zone                    NOT NULL DEFAULT now(),
            updated_at  timestamp without time zone                    NOT NULL DEFAULT now(),
            CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id),
            CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email)
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS public.users`);
  }
}
