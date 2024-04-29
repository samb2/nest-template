import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { SortEnum } from '../../utils/enums/sort.enum';

export class GetFilesQueryDto {
  @ApiPropertyOptional({ enum: SortEnum, default: SortEnum.ASC })
  @IsEnum(SortEnum)
  @IsOptional()
  readonly sort?: SortEnum = SortEnum.ASC;

  @ApiPropertyOptional({
    enum: ['id', 'name', 'size', 'createdAt', 'bucket'],
    default: 'createdAt',
  })
  @IsOptional()
  readonly sortField?: 'id' | 'name' | 'size' | 'bucket' | 'createdAt';

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
