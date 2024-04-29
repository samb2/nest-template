import { ApiProperty } from '@nestjs/swagger';
import { File } from '../../entities/file.entity';
import { PageMetaDto } from '../../../common/dto/page-meta.dto';

export class UploadFileResDto {
  @ApiProperty({ type: [File] })
  files: File[];

  @ApiProperty({ type: PageMetaDto })
  pageMeta: PageMetaDto;

  constructor(partial: Partial<UploadFileResDto>) {
    Object.assign(this, partial);
  }
}
