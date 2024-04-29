import { PartialType } from '@nestjs/swagger';
import { CreateBucketDto } from './create-bucket.dto';

export class UpdateMinioDto extends PartialType(CreateBucketDto) {}
