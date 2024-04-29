import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ImageFilterInterceptor } from './interceptors/image-filter.interceptor';
import { ApiOkResponseSuccess } from '../utils/ApiOkResponseSuccess.util';
import {
  DeleteFileResDto,
  GetFilesQueryDto,
  UploadFileDto,
  UploadFileResDto,
} from './dto';
import { PermissionEnum } from '../common/enums';
import { Permissions } from '../common/decorator/permissions.decorator';
import { File } from './entities/file.entity';
import { AccessTokenGuard, PermissionGuard } from '../common/guard';

@ApiTags('files')
@Controller('files')
@ApiBearerAuth()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Permissions(PermissionEnum.CREATE_AVATAR)
  @Post('/upload/avatar')
  @ApiOperation({
    summary: 'Upload avatar',
    description: 'Upload a new avatar for the user.',
  })
  @ApiOkResponseSuccess(UploadFileResDto)
  @ApiBadRequestResponse({ description: 'Bad Request!' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiInternalServerErrorResponse()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload avatar',
    type: UploadFileDto,
  })
  @UseInterceptors(FileInterceptor('file'), ImageFilterInterceptor)
  uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ): Promise<File> {
    return this.fileService.uploadAvatar(file, req.user);
  }

  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Permissions(PermissionEnum.READ_FILE)
  @Get()
  @ApiOperation({ summary: 'Find all files' })
  @ApiOkResponseSuccess(UploadFileResDto, 200, true)
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  findAll(@Query() getFileDto?: GetFilesQueryDto): Promise<UploadFileResDto> {
    return this.fileService.findAll(getFileDto);
  }

  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Permissions(PermissionEnum.READ_FILE)
  @Get(':id')
  @ApiOperation({ summary: 'Find one file' })
  @ApiOkResponseSuccess(UploadFileResDto)
  @ApiBadRequestResponse({ description: 'Bad Request!' })
  @ApiNotFoundResponse({ description: 'File not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.fileService.findOne(id);
  }

  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Permissions(PermissionEnum.DELETE_FILE)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete one file' })
  @ApiOkResponseSuccess(DeleteFileResDto)
  @ApiBadRequestResponse({ description: 'Bad Request!' })
  @ApiNotFoundResponse({ description: 'File not found' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteFileResDto> {
    return this.fileService.remove(id);
  }
}
