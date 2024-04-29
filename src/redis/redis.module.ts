import { Module, Global } from '@nestjs/common';
import { redisAuthFactory } from './redis-client.factory';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [redisAuthFactory, RedisService],
  exports: [RedisService],
})
export class RedisModule {}
