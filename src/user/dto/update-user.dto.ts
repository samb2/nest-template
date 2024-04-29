import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'John', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Due', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ type: Boolean })
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ type: Boolean, default: false })
  @IsOptional()
  isDelete?: boolean;

  @ApiProperty({ type: Boolean, default: false })
  @IsOptional()
  admin?: boolean;
}
