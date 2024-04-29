import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'foo@bar.com', required: true })
  @IsEmail()
  email: string;
}
