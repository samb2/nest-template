import * as process from 'process';
import { DataSource, DataSourceOptions } from 'typeorm';

import * as dotenv from 'dotenv';

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

const databaseConfig: object = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + `/../database/migrations/*.js`],
  synchronize: JSON.parse(process.env.DB_SYNCHRONIZE) || false,
  logging: JSON.parse(process.env.DB_LOGGING) || false,
  dropSchema: JSON.parse(process.env.DB_DROP_SCHEMA) || false, // This drops the schema before each test run
  migrationsTableName: 'migrations',
  migrationsRun: JSON.parse(process.env.DB_MIGRATION_RUN) || false,
};

export { databaseConfig as database };

export const dataSource: DataSource = new DataSource(
  databaseConfig as DataSourceOptions,
);
