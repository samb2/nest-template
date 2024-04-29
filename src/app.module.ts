import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import * as process from 'process';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { HealthController } from './health/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { PassportModule } from '@nestjs/passport';
import { RedisHealthIndicator, RedisModule } from './redis';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { MinioModule } from './minio/minio.module';
import { FileModule } from './file/file.module';
import { AccessTokenStrategy, RefreshTokenStrategy } from './common/passport';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [configuration],
      cache: true,
    }),
    TerminusModule,
    DatabaseModule,
    RedisModule,
    PassportModule.register({ defaultStrategy: 'jwt-access' }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('rateLimit.THROTTLE_TTL'),
          limit: configService.get<number>('rateLimit.THROTTLE_LIMIT'),
        },
      ],
    }),
    AuthModule,
    UserModule,
    ProfileModule,
    MinioModule,
    FileModule,
    EventsModule,
    RoleModule,
    PermissionModule,
    TokenModule,
  ],
  controllers: [HealthController],
  providers: [
    RedisHealthIndicator,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
