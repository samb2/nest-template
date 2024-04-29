import { ApiProperty } from '@nestjs/swagger';

export class DeleteRoleResDto {
  @ApiProperty({ example: 'Role deleted successfully' })
  message: string;

  constructor(partial: Partial<DeleteRoleResDto>) {
    Object.assign(this, partial);
  }
}
