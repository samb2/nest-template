import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordResDto {
  @ApiProperty({ example: 'Password update successfully' })
  message: string;

  constructor(partial: Partial<UpdatePasswordResDto>) {
    Object.assign(this, partial);
  }
}
