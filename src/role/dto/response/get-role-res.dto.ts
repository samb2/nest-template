import { ApiProperty } from '@nestjs/swagger';

class RolePermissions {
  @ApiProperty({})
  id: string;

  @ApiProperty({})
  permission: string;

  constructor(partial: Partial<RolePermissions>) {
    Object.assign(this, partial);
  }
}

export class GetRoleResDto {
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

  @ApiProperty({ type: () => [RolePermissions], nullable: true })
  rolePermissions: RolePermissions[];

  constructor(partial: Partial<GetRoleResDto>) {
    Object.assign(this, partial);
    this.rolePermissions =
      this.rolePermissions?.map((role) => new RolePermissions(role)) || [];
  }
}
