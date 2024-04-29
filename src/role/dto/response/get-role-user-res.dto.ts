import { ApiProperty } from '@nestjs/swagger';

// DTO for the Role object
class RoleResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

// DTO for the UserRoles object
class UserRoleResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: () => RoleResponseDto })
  role: RoleResponseDto;
}

// DTO for the User object
export class RoleUserResDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isDelete: boolean;

  @ApiProperty({ type: [UserRoleResponseDto] })
  userRoles: UserRoleResponseDto[];
}
