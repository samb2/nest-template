import { ApiProperty } from '@nestjs/swagger';

export class RegisterResDto {
  @ApiProperty({
    example: 'Register Successfully',
  })
  message: string;

  constructor(partial: Partial<RegisterResDto>) {
    Object.assign(this, partial);
  }
}
