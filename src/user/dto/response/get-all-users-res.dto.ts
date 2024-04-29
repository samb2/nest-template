import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../auth/entities';
import { PageMetaDto } from '../../../common/dto/page-meta.dto';

export class GetAllUsersResDto {
  @ApiProperty({ type: [User] })
  users: User[];

  @ApiProperty({ type: PageMetaDto })
  pageMeta: PageMetaDto;

  constructor(partial: Partial<GetAllUsersResDto>) {
    Object.assign(this, partial);
  }
}
