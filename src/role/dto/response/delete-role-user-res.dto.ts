import { ApiProperty } from '@nestjs/swagger';

// DTO for the User object
export class DeleteRoleUserResDto {
  @ApiProperty({
    example: 'The role has been successfully removed from the user.',
  })
  message: string;
}
