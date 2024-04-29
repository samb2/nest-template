import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRoleDto {
  @ApiProperty({ example: 'writer', required: true })
  @IsString()
  name: string;

  @ApiProperty({ example: 'this role for writer', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    type: () => String,
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  @Type(() => String)
  permissionIds?: string[];
}
