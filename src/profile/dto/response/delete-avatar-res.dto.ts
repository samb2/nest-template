import { ApiProperty } from '@nestjs/swagger';

export class DeleteAvatarResDto {
  @ApiProperty({ example: 'Avatar delete successfully' })
  message: string;

  constructor(partial: Partial<DeleteAvatarResDto>) {
    Object.assign(this, partial);
  }
}
