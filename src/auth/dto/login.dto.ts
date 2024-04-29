import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'foo@bar.com', required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345678', required: true })
  @IsString()
  @Length(8, 20, {
    message: 'Password length must be between 8 and 20 characters',
  })
  password: string;
}
