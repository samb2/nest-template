import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { ChatsGateway } from './gateway/chats.gateway';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { User } from '../auth/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User]), TokenModule, UserModule],
  providers: [ChatsGateway, MessageService],
})
export class MessageModule {}
