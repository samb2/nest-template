import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from '../../../utils/dto/page-meta.dto';
import { User } from '../../../auth/entities';

export class GetAllUsersResDto {
  @ApiProperty({ type: [User] })
  users: User[];

  @ApiProperty({ type: PageMetaDto })
  pageMeta: PageMetaDto;

  constructor(partial: Partial<GetAllUsersResDto>) {
    Object.assign(this, partial);
  }
}
