import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  Req,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiOkResponseSuccess } from '../utils/ApiOkResponseSuccess.util';
import {
  DeleteAvatarResDto,
  GetProfileResDto,
  UpdatePasswordDto,
  UpdatePasswordResDto,
  UpdateProfileDto,
  UpdateProfileResDto,
} from './dto';
import { Permissions } from '../common/decorator/permissions.decorator';
import { User } from '../auth/entities';
import { PermissionEnum } from '../common/enums';
import { AccessTokenGuard, PermissionGuard } from '../common/guard';

@ApiTags('profile')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Permissions(PermissionEnum.READ_PROFILE)
  @Get()
  @ApiOperation({ summary: 'Find one profile' })
  @ApiOkResponseSuccess(GetProfileResDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Req() req: any): Promise<User> {
    return this.profileService.findOne(req.user);
  }

  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Permissions(PermissionEnum.UPDATE_PROFILE)
  @Patch()
  @ApiOperation({ summary: 'Update profile' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiOkResponseSuccess(UpdateProfileResDto)
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  update(
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() req: any,
  ): Promise<UpdateProfileResDto> {
    return this.profileService.update(updateProfileDto, req.user);
  }

  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Permissions(PermissionEnum.UPDATE_PROFILE)
  @Patch('/password')
  @ApiOperation({ summary: 'Update password' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiOkResponseSuccess(UpdatePasswordResDto)
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({
    description: 'Your old password is incorrect',
  })
  updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Req() req: any,
  ): Promise<UpdatePasswordResDto> {
    return this.profileService.updatePassword(updatePasswordDto, req.user);
  }

  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Permissions(PermissionEnum.DELETE_AVATAR)
  @Delete('/avatar')
  @ApiOperation({ summary: 'Delete avatar' })
  @ApiOkResponseSuccess(DeleteAvatarResDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse()
  deleteAvatar(@Req() req: any): Promise<DeleteAvatarResDto> {
    return this.profileService.deleteAvatar(req.user.id, req.user.avatar);
  }
}
