import { ApiProperty } from '@nestjs/swagger';

export class GetProfileResDto {
  @ApiProperty({})
  id: string;

  @ApiProperty({})
  authId: string;

  @ApiProperty({})
  email: string;

  @ApiProperty({})
  avatar: string;

  @ApiProperty({})
  firstName: string;

  @ApiProperty({})
  lastName: string;

  @ApiProperty({})
  createdAt: Date;

  constructor(partial: Partial<GetProfileResDto>) {
    Object.assign(this, partial);
  }
}
