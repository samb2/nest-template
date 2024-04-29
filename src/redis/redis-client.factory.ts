import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const redisAuthFactory: FactoryProvider<Redis> = {
  provide: 'Redis',
  useFactory: (configService: ConfigService) => {
    const redisInstance: Redis = new Redis({
      host: configService.get('redis.host_auth'),
      port: configService.get('redis.port_auth'),
      password: configService.get('redis.password_auth'),
    });

    redisInstance.on('error', (e) => {
      throw new Error(`Redis connection failed: ${e}`);
    });

    return redisInstance;
  },
  inject: [ConfigService],
};
