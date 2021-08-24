import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';
import { UserPersonalDataType } from 'src/user/type/users.type';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
  }

  async validateUserById(id: number): Promise<User> {
    const user = await this.userService.findOne({ id });

    if (user) {
      return user;
    }
  }

  generateToken(user: UserPersonalDataType): string {
    const payload = { id: user.id };
    return this.jwtService.sign(payload);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }
}
