import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Put,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { Public } from 'src/auth/public.decorator';
import {
  CreateUserRequestDto,
  UpdateUserRequestDto,
  UserResponse,
} from './dto/users.dto';
import { UserService } from './user.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/users/login')
  async signin(@Request() req): Promise<UserResponse> {
    const user = await this.userService.signin(req.user);
    return plainToClass(UserResponse, {
      user,
    });
  }

  @Public()
  @Post('users')
  async signup(
    @Body('user') createUserRequestDto: CreateUserRequestDto,
  ): Promise<UserResponse> {
    const user = await this.userService.signup(createUserRequestDto);
    return plainToClass(UserResponse, {
      user,
    });
  }

  @Get('user')
  async getCurrentUser(@Request() req): Promise<UserResponse> {
    const user = await this.userService.getCurrentUser(req.user);
    return plainToClass(UserResponse, {
      user,
    });
  }

  @Put('user')
  async update(
    @Request() req,
    @Body('user') updateUserRequestDto: UpdateUserRequestDto,
  ): Promise<UserResponse> {
    const user = await this.userService.update(req.user, updateUserRequestDto);
    return plainToClass(UserResponse, {
      user,
    });
  }
}
