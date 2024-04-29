import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';

export class LoginResDto {
  user: User;

  @ApiProperty({
    example: 'your_access_token_example_here',
    description: 'This is jwt access token',
  })
  access_token: string;

  @ApiProperty({
    example: 'your_refresh_token_example_here',
    description: 'This is jwt refresh token',
  })
  refresh_token: string;

  constructor(partial: Partial<LoginResDto>) {
    Object.assign(this, partial);
  }
}
