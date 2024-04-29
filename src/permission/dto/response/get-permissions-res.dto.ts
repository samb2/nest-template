import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from '../../../utils/dto/page-meta.dto';

export class PermissionDto {
  @ApiProperty({})
  id: string;

  @ApiProperty({})
  access: string;
}

export class GetPermissionRes {
  @ApiProperty({ type: [PermissionDto] })
  permissions: PermissionDto[];

  @ApiProperty({ type: PageMetaDto })
  pageMeta: PageMetaDto;

  constructor(partial: Partial<GetPermissionRes>) {
    Object.assign(this, partial);
  }
}
