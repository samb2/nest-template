import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiOkResponseSuccess } from '../utils/ApiOkResponseSuccess.util';
import {
  AssignRoleResDto,
  CreateRoleDto,
  CreateRoleResDto,
  DeleteRoleResDto,
  DeleteRoleUserResDto,
  GetAllRoleResDto,
  GetRoleQueryDto,
  GetRoleResDto,
  RoleUserResDto,
  UpdateRoleDto,
} from './dto';
import { Role } from './entities';
import { User, UsersRoles } from '../auth/entities';
import { Permissions } from '../common/decorator/permissions.decorator';
import { PermissionEnum } from '../common/enums';
import { AccessTokenGuard, PermissionGuard } from '../common/guard';

@ApiTags('roles')
@ApiBearerAuth()
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Permissions(PermissionEnum.CREATE_ROLE)
  @Post()
  @ApiOperation({ summary: 'create role' })
  @ApiBody({ type: CreateRoleDto })
  @ApiOkResponseSuccess(CreateRoleResDto, 200)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({
    description: 'Duplicated permission IDs found: ',
  })
  @ApiNotFoundResponse({
    description: 'Permissions with IDs not found.',
  })
  @ApiConflictResponse({ description: 'Role already exists!' })
  create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.create(createRoleDto);
  }

  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Permissions(PermissionEnum.READ_ROLE)
  @Get()
  @ApiOperation({ summary: 'get all roles' })
  @ApiOkResponseSuccess(GetAllRoleResDto, 200)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({ type: GetRoleQueryDto })
  findAll(@Query() getRoleDto?: GetRoleQueryDto): Promise<GetAllRoleResDto> {
    return this.roleService.findAll(getRoleDto);
  }

  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Permissions(PermissionEnum.READ_ROLE)
  @Get(':id')
  @ApiOperation({ summary: 'get a role with id' })
  @ApiOkResponseSuccess(GetRoleResDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Role not found!' })
  findOne(@Param('id') id: string): Promise<Role> {
    return this.roleService.findOne(+id);
  }

  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Permissions(PermissionEnum.UPDATE_ROLE)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a role' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the role to update',
  })
  @ApiBody({ type: UpdateRoleDto })
  @ApiOkResponseSuccess(GetRoleResDto)
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Role not found' })
  @ApiConflictResponse({ description: 'Role name already exists' })
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.roleService.update(+id, updateRoleDto);
  }

  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Permissions(PermissionEnum.DELETE_ROLE)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a role' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the role to delete',
  })
  @ApiOkResponseSuccess(DeleteRoleResDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Role not found' })
  remove(@Param('id') id: string): Promise<DeleteRoleResDto> {
    return this.roleService.remove(+id);
  }

  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Permissions(PermissionEnum.READ_ROLE)
  @Get('/users/:userId')
  @ApiOperation({ summary: 'Get user roles' })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'ID of the user to get roles for',
  })
  @ApiOkResponseSuccess(RoleUserResDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'User not found' })
  getUserRoles(@Param('userId', ParseUUIDPipe) userId: string): Promise<User> {
    return this.roleService.getUserRoles(userId);
  }

  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Permissions(PermissionEnum.CREATE_ROLE)
  @Post(':id/users/:userId')
  @ApiOperation({ summary: 'Assign a role to a user' })
  @ApiParam({ name: 'id', description: 'The ID of the role', required: true })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user',
    required: true,
  })
  @ApiOkResponseSuccess(AssignRoleResDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Role or user not found.' })
  @ApiConflictResponse({
    description: 'This role is already assigned to this user.',
  })
  assignRoleToUser(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<UsersRoles> {
    return this.roleService.assignRoleToUser(id, userId);
  }

  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Permissions(PermissionEnum.DELETE_ROLE)
  @Delete(':id/users/:userId')
  @ApiOperation({ summary: 'Delete a user role' })
  @ApiParam({ name: 'id', description: 'The role ID', required: true })
  @ApiParam({ name: 'userId', description: 'The user ID', required: true })
  @ApiOkResponseSuccess(DeleteRoleUserResDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Role or User not found.' })
  deleteUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<DeleteRoleUserResDto> {
    return this.roleService.deleteUserRole(id, userId);
  }
}
