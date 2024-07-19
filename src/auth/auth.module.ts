import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from '../token/token.module';
import { ResetPassword, User } from './entities';

// import { Message } from '../message/entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      ResetPassword,
      //Message
    ]),
    TokenModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
