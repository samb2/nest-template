import { ApiProperty } from '@nestjs/swagger';

export class LogoutResDto {
  @ApiProperty({
    example: 'Email Send Successfully',
  })
  message: string;
}
