import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'changePassword', required: true })
  @IsString()
  password: string;

  @ApiProperty({ example: 'token', required: true })
  @IsJWT()
  token: string;
}
