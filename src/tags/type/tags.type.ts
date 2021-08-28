import { Prisma } from '@prisma/client';

export const TagData = Prisma.validator<Prisma.TagArgs>()({
  select: { id: true, name: true },
});

export type TagDataType = Prisma.TagGetPayload<typeof TagData>;
