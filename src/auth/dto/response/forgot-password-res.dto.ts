import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordResDto {
  @ApiProperty({
    example: 'Email Send Successfully',
  })
  message: string;
}
