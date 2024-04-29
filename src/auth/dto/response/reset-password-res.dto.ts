import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordResDto {
  @ApiProperty({
    example: 'Your password Changed Successfully',
  })
  message: string;
}
