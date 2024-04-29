import { Controller, Get, UseGuards } from '@nestjs/common';
import { MinioService } from './minio.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiOkResponseSuccess } from '../utils/ApiOkResponseSuccess.util';
import { AccessTokenGuard, PermissionGuard } from '../utils/guard';
import { GetBucketResDto } from './dto';
import { PermissionEnum } from '../utils/enums/permission.enum';
import { Permissions } from '../utils/decorator/permissions.decorator';
import { BucketEnum } from './enum/bucket.enum';

@ApiTags('minio')
@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Permissions(PermissionEnum.READ_BUCKET)
  @Get()
  @ApiOperation({ summary: 'get all buckets' })
  @ApiOkResponseSuccess(GetBucketResDto, 200, true)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  findAll(): Promise<BucketEnum[]> {
    return this.minioService.findAll();
  }
}
