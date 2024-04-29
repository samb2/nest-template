import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'John', required: false })
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Due', required: false })
  @IsOptional()
  @IsString()
  lastName: string;
}
