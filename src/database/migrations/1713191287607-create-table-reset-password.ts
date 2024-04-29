import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableResetPassword1713191287607
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS public.reset_password
        (
            id         uuid                                           NOT NULL DEFAULT uuid_generate_v4(),
            token      character varying COLLATE pg_catalog."default" NOT NULL,
            use        boolean                                        NOT NULL DEFAULT false,
            created_at timestamp without time zone                    NOT NULL DEFAULT now(),
            user_id    uuid,
            CONSTRAINT "PK_82bffbeb85c5b426956d004a8f5" PRIMARY KEY (id),
            CONSTRAINT "FK_de65040d842349a5e6428ff21e6" FOREIGN KEY (user_id)
                REFERENCES public.users (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS public.reset_password`);
  }
}
