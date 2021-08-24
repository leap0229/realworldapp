import {
  ConflictException,
  InternalServerErrorException,
  Injectable,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserRequestDto, UserResponseDto } from './dto/users.dto';
import { UserPersonalData, UserPersonalDataType } from './type/users.type';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async signup(
    createUserRequestDto: CreateUserRequestDto,
  ): Promise<UserResponseDto> {
    const { password } = createUserRequestDto;
    const hashedPassword = await this.authService.hashPassword(password);

    let newUser: UserPersonalDataType;
    try {
      newUser = await this.prisma.user.create({
        data: { ...createUserRequestDto, password: hashedPassword },
        select: UserPersonalData.select,
      });
    } catch (err) {
      if (err.code === 'P2002') {
        throw new ConflictException('User already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }

    const token = this.authService.generateToken(newUser);
    return { ...newUser, token };
  }

  async signin(user: User): Promise<UserResponseDto> {
    const token = this.authService.generateToken(user);

    return { ...user, token };
  }

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });

    return user;
  }

  async getCurrentUser(user: User): Promise<UserResponseDto> {
    const token = this.authService.generateToken(user);

    return { ...user, token };
  }

  async update(
    reqUser: User,
    userUpdateInput: Prisma.UserUpdateInput,
  ): Promise<UserResponseDto> {
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

    const token = this.authService.generateToken(updatedUser);
    return { ...updatedUser, token };
  }
}
