import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleResDto {
  @ApiProperty({ example: 123456 })
  id: number;

  @ApiProperty({ example: 'writer' })
  name: string;

  @ApiProperty({ example: 'this role for writer' })
  description: string;

  @ApiProperty({})
  createdAt: Date;

  @ApiProperty({})
  updatedAt: Date;

  constructor(partial: Partial<CreateRoleResDto>) {
    Object.assign(this, partial);
  }
}
