import * as dotenv from 'dotenv';

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});
import { rateLimit } from './rateLimit.config';
import { cors } from './cors.config';
import { server } from './server.config';
import { jwt } from './jwt.config';
import { database } from './database.config';
import { redis } from './redis.config';
import { minio } from './minio.config';
import { email } from './email.config';

export default () => ({
  server,
  database,
  redis,
  jwt,
  rateLimit,
  cors,
  minio,
  email,
});
