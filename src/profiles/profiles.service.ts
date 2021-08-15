import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileResponseObject } from './dto/profiles.dto';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async getProfile(
    reqUser: User,
    username: string,
  ): Promise<ProfileResponseObject> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { followedBy: true },
    });

    const isFollowing = user?.followedBy.find((user) => reqUser.id === user.id);

    const { id, email, password, followedBy, ...profile } = user;
    return { profile: { ...profile, following: !!isFollowing } };
  }

  async followUser(
    reqUser: User,
    username: string,
  ): Promise<ProfileResponseObject> {
    const followedUser = await this.prisma.user.findUnique({
      where: { username },
    });

    const user = await this.prisma.user.update({
      where: { id: reqUser.id },
      data: { following: { connect: { id: followedUser.id } } },
    });

    const { id, email, password, ...profile } = user;
    return { profile: { ...profile, following: true } };
  }

  async unFollowUser(user: User, username: string): Promise<any> {
    const followedUser = await this.prisma.user.findUnique({
      where: { username },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { following: { disconnect: { id: followedUser.id } } },
    });

    const { id, email, password, ...profile } = user;
    return { profile: { ...profile, following: false } };
  }
}
