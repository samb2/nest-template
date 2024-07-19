import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities';
import { Samb2Module } from '../samb2/samb2.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), Samb2Module],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
