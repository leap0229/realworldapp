import { Prisma } from '@prisma/client';

export const UserPersonalData = Prisma.validator<Prisma.UserArgs>()({
  select: { id: true, email: true, username: true, bio: true, image: true },
});

export type UserPersonalDataType = Prisma.UserGetPayload<
  typeof UserPersonalData
>;
