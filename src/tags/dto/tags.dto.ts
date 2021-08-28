import { Exclude, Transform, Type } from 'class-transformer';
import { TagDataType } from '../type/tags.type';

export class TagsResponseDto implements TagDataType {
  @Exclude()
  id: number;

  name: string;
}

export class TagsResponse {
  @Type(() => TagsResponseDto)
  @Transform(({ value }: { value: TagsResponseDto[] }) =>
    value.map(({ name }) => name),
  )
  tags: string[];
}
