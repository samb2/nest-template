import { ApiProperty } from '@nestjs/swagger';

export class RoleResponseDto {
  @ApiProperty({ example: 679829, description: 'The ID of the role' })
  id: number;

  @ApiProperty({ example: 'user', description: 'The name of the role' })
  name: string;
}

export class UserResponseDto {
  @ApiProperty({
    example: '8ff287f8-f26f-49e7-b0ba-c13df26fef5f',
    description: 'The ID of the user',
  })
  id: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the user is active',
  })
  isActive: boolean;

  @ApiProperty({
    example: false,
    description: 'Indicates if the user is deleted',
  })
  isDelete: boolean;
}

export class AssignRoleResDto {
  @ApiProperty({ type: RoleResponseDto })
  role: RoleResponseDto;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({
    example: 'c488975b-75e5-4069-a7a7-3675fb99f95b',
    description: 'The ID of the user-role relationship',
  })
  id: string;
}
