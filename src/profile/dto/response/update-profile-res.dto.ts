import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileResDto {
  @ApiProperty({ example: 'profile update successfully' })
  message: string;

  constructor(partial: Partial<UpdateProfileResDto>) {
    Object.assign(this, partial);
  }
}
