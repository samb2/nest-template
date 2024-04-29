import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableFiles1714389303585 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS public.files
        (
            id          uuid                                           NOT NULL DEFAULT uuid_generate_v4(),
            name        character varying COLLATE pg_catalog."default" NOT NULL,
            "mimeType"  character varying COLLATE pg_catalog."default" NOT NULL,
            size        integer                                        NOT NULL,
            key         character varying COLLATE pg_catalog."default" NOT NULL,
            bucket      character varying COLLATE pg_catalog."default" NOT NULL,
            path        character varying COLLATE pg_catalog."default" NOT NULL,
            uploaded_by character varying COLLATE pg_catalog."default" NOT NULL,
            created_at  timestamp without time zone                    NOT NULL DEFAULT now(),
            CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY (id),
            CONSTRAINT "UQ_a5c218dfdf6ad6092fed2230a88" UNIQUE (key)
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS public.files`);
  }
}
