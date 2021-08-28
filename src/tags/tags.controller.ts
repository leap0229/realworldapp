import { Controller, Get } from '@nestjs/common';
import { TagsService } from './tags.service';
import { Public } from 'src/auth/public.decorator';
import { TagsResponse } from './dto/tags.dto';
import { plainToClass } from 'class-transformer';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Public()
  @Get()
  async getAllTags(): Promise<TagsResponse> {
    const tags = await this.tagsService.getAllTags();
    return plainToClass(TagsResponse, {
      tags,
    });
  }
}
