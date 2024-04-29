import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from '../token/token.module';
import { ResetPassword, User } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, ResetPassword]), TokenModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
