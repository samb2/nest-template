import { Inject, Injectable } from '@nestjs/common';
import Redis, { RedisKey } from 'ioredis';
import { IRedisServiceInterface } from './interface/IRedisService.interface';
import { RedisKeyEnum } from './enum/redis-key.enum';

@Injectable()
export class RedisService implements IRedisServiceInterface {
  constructor(@Inject('Redis') private readonly redisClient: Redis) {}

  async get(key: RedisKey): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async set(
    key: RedisKey,
    value: string | number | Buffer,
    expiration?: number,
  ): Promise<void> {
    if (expiration) {
      await this.redisClient.set(key, value, 'EX', expiration);
    }
    await this.redisClient.set(key, value);
  }

  async delete(key: RedisKey): Promise<number> {
    return this.redisClient.del(key);
  }

  // Other Redis operations
  async hSet(
    key: RedisKey,
    field: string | Buffer | number,
    value: string | Buffer | number,
  ): Promise<number> {
    return this.redisClient.hset(key, field, value);
  }

  async hGet(key: RedisKey, field: string | Buffer): Promise<string | null> {
    return this.redisClient.hget(key, field);
  }

  async setEx(
    key: RedisKey,
    second: string | number,
    value: string | number | Buffer,
  ): Promise<void> {
    await this.redisClient.setex(key, second, value);
  }

  async getEx(key: RedisKey): Promise<string | null> {
    return this.redisClient.getex(key);
  }

  async ping(): Promise<string> {
    return this.redisClient.ping();
  }

  generateRoleKey(value: string): string {
    return `${RedisKeyEnum.ROLE}-${value}`;
  }

  generateRefreshKey(value: string): string {
    return `${RedisKeyEnum.REFRESH}-${value}`;
  }
}
