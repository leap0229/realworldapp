import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TagsResponseDto } from './dto/tags.dto';
import { TagData } from './type/tags.type';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async getAllTags(): Promise<TagsResponseDto[]> {
    return this.prisma.tag.findMany({ select: TagData.select });
  }
}
