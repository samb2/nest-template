import { RedisKey } from 'ioredis';

export interface IRedisServiceInterface {
  get(key: RedisKey): Promise<string | null>;

  set(
    key: RedisKey,
    value: string | number | Buffer,
    expiration?: number,
  ): Promise<void>;

  delete(key: RedisKey): Promise<number>;

  hSet(
    key: RedisKey,
    field: string | Buffer | number,
    value: string | Buffer | number,
  ): Promise<number>;

  hGet(key: RedisKey, field: string | Buffer): Promise<string | null>;

  setEx(
    key: RedisKey,
    second: string | number,
    value: string | number | Buffer,
  ): Promise<void>;

  getEx(key: RedisKey): Promise<string | null>;

  ping(): Promise<string>;

  generateRoleKey(value: string): string;

  generateRefreshKey(value: string): string;
}
