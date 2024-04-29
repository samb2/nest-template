import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableRoles1713191314512 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS public.roles
        (
            id          integer                                        NOT NULL,
            name        character varying COLLATE pg_catalog."default" NOT NULL,
            description character varying COLLATE pg_catalog."default",
            created_at  timestamp without time zone                    NOT NULL DEFAULT now(),
            updated_at  timestamp without time zone                    NOT NULL DEFAULT now(),
            CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY (id),
            CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE (name)
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS public.roles`);
  }
}
