import { Prisma } from '@prisma/client';

export interface User {
  email: string;
  username: string;
  bio: string;
  image: string;
  token: string;
}

export interface UserResponseObject {
  user: User;
}

export const UserPersonalData = Prisma.validator<Prisma.UserArgs>()({
  select: { id: true, email: true, username: true, bio: true, image: true },
});
