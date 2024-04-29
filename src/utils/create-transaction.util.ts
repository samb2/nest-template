import { DataSource, QueryRunner } from 'typeorm';

export async function createTransaction(
  datasource: DataSource,
): Promise<QueryRunner> {
  const queryRunner: QueryRunner = datasource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  return queryRunner;
}
