import { ApiProperty } from '@nestjs/swagger';

export class GetUserResDto {
  @ApiProperty({})
  id: string;

  @ApiProperty({})
  email: string;

  @ApiProperty({})
  avatar: string;

  @ApiProperty({})
  firstName: string;

  @ApiProperty({})
  lastName: string;

  @ApiProperty({})
  isActive: boolean;

  @ApiProperty({ default: false })
  isDelete: boolean;

  @ApiProperty({ default: false })
  admin: boolean;

  @ApiProperty({})
  createdAt: Date;

  constructor(partial: Partial<GetUserResDto>) {
    Object.assign(this, partial);
  }
}
