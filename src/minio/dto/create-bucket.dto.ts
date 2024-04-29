import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBucketDto {
  @ApiProperty({ example: 'images', required: true })
  @IsString()
  name: string;
}
