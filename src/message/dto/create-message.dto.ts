import { IsEnum, IsString, IsUUID } from 'class-validator';
import { ContentTypeEnum } from '../enum';
import { User } from '../../auth/entities';

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsEnum(ContentTypeEnum)
  contentType: ContentTypeEnum;

  @IsUUID()
  sender: User;

  @IsUUID()
  recipient: User;
}
