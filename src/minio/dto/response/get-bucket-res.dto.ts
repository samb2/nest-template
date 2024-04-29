import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetBucketResDto {
  @ApiProperty({ example: 'images', required: true })
  @IsString()
  name: string;

  @ApiProperty({ example: 'string', required: true })
  @IsString()
  id: string;
}
