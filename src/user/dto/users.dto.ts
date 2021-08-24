import { Prisma } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserPersonalDataType } from '../type/users.type';

export class CreateUserRequestDto implements Prisma.UserCreateInput {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;
}

export class UpdateUserRequestDto implements Prisma.UserUpdateInput {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username?: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  bio?: string;
}

export class UserResponseDto implements UserPersonalDataType {
  email: string;
  username: string;
  bio: string;
  image: string;
  token: string;

  @Exclude()
  id: number;

  @Exclude()
  password?: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}

export class UserResponse {
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  constructor(partial: Partial<UserResponse>) {
    Object.assign(this, partial);
  }
}
