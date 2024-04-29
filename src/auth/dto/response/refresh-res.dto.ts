import { ApiProperty } from '@nestjs/swagger';

export class RefreshResDto {
  @ApiProperty({
    example: 'your_access_token_example_here',
    description: 'This is jwt access token',
  })
  access_token: string;

  constructor(partial: Partial<RefreshResDto>) {
    Object.assign(this, partial);
  }
}
