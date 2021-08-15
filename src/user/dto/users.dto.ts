import { Prisma } from '@prisma/client';

export type User = {
  email: string;
  username: string;
  bio: string;
  image: string;
};

export interface AuthenticatedUser extends User {
  token: string;
}

export interface UserResponseObject {
  user: AuthenticatedUser;
}

export type UserPersonalDataType = Prisma.UserGetPayload<
  typeof UserPersonalData
>;

export const UserPersonalData = Prisma.validator<Prisma.UserArgs>()({
  select: { id: true, email: true, username: true, bio: true, image: true },
});
