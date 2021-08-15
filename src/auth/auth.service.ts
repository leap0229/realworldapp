import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';
import { UserPersonalDataType } from 'src/user/dto/users.dto';

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

  async generateToken(user: UserPersonalDataType): Promise<string> {
    const payload = { id: user.id };
    return this.jwtService.sign(payload);
  }
}
