import { ConflictException } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { genJWT } from './helper/auth';
import { UserPersonalData, UserResponseObject } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(
    userCreateInput: Prisma.UserCreateInput,
  ): Promise<UserResponseObject> {
    const { password } = userCreateInput;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser: Prisma.UserGetPayload<typeof UserPersonalData>;
    try {
      newUser = await this.prisma.user.create({
        data: { ...userCreateInput, password: hashedPassword },
        select: UserPersonalData.select,
      });
    } catch (err) {
      if (err.code === 'P2002') {
        throw new ConflictException('User already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }

    const { id, ...user } = newUser;
    const jwt = genJWT({ id });

    return { user: { ...user, token: jwt } };
  }

  /*
  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }*/
}
