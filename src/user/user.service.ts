import { ConflictException } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import {
  UserPersonalDataType,
  UserPersonalData,
  UserResponseObject,
} from './dto/users.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async signup(
    userCreateInput: Prisma.UserCreateInput,
  ): Promise<UserResponseObject> {
    const { password } = userCreateInput;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser: UserPersonalDataType;
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

    const jwt = await this.authService.generateToken(newUser);
    const { id, ...user } = newUser;
    return { user: { ...user, token: jwt } };
  }

  async signin(user: User): Promise<UserResponseObject> {
    const { id, password, ...resUser } = user;
    const jwt = await this.authService.generateToken(user);

    return { user: { ...resUser, token: jwt } };
  }

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });

    return user;
  }

  async getCurrentUser(user: User): Promise<UserResponseObject> {
    const { id, password, ...resUser } = user;
    const jwt = await this.authService.generateToken(user);
    return { user: { ...resUser, token: jwt } };
  }

  async update(
    reqUser: User,
    userUpdateInput: Prisma.UserUpdateInput,
  ): Promise<UserResponseObject> {
    let updatedUser: UserPersonalDataType;
    try {
      updatedUser = await this.prisma.user.update({
        where: { id: reqUser.id },
        data: { ...userUpdateInput },
        select: UserPersonalData.select,
      });
    } catch (err) {
      if (err.code === 'P2002') {
        throw new ConflictException('User already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }

    const jwt = await this.authService.generateToken(updatedUser);
    const { id, ...user } = updatedUser;
    return { user: { ...user, token: jwt } };
  }
}
