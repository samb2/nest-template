import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from '../../../utils/dto/page-meta.dto';
import { File } from '../../entities/file.entity';

export class UploadFileResDto {
  @ApiProperty({ type: [File] })
  files: File[];

  @ApiProperty({ type: PageMetaDto })
  pageMeta: PageMetaDto;

  constructor(partial: Partial<UploadFileResDto>) {
    Object.assign(this, partial);
  }
}
