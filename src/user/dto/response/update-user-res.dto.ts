import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserResDto {
  @ApiProperty({
    example: 'The user has been successfully updated.',
  })
  message: string;

  constructor(partial: Partial<UpdateUserResDto>) {
    Object.assign(this, partial);
  }
}
