import { ApiProperty } from '@nestjs/swagger';

export class DeleteFileResDto {
  @ApiProperty({ example: 'This action removes a file' })
  message: string;
}
