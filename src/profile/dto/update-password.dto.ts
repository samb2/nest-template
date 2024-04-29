import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({ example: '12345678', required: true })
  @IsOptional()
  @IsString()
  oldPassword: string;

  @ApiProperty({ example: '87654321', required: true })
  @IsOptional()
  @IsString()
  newPassword: string;
}
