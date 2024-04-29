import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities';
import { User, UsersRoles } from '../auth/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User, UsersRoles])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
