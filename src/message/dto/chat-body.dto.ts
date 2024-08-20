import { ContentTypeEnum } from '../enum';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ChatBodyDto {
  @IsNotEmpty()
  @IsUUID()
  to: string;

  @IsNotEmpty()
  @IsEnum(ContentTypeEnum)
  contentType: ContentTypeEnum;

  @IsNotEmpty()
  @IsString()
  content: string;
}
