import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Put,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { Public } from 'src/auth/public.decorator';
import { UserResponseObject } from './dto/users.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/users/login')
  async signin(@Request() req): Promise<UserResponseObject> {
    return this.userService.signin(req.user);
  }

  @Public()
  @Post('users')
  signup(
    @Body('user') userCreateInput: Prisma.UserCreateInput,
  ): Promise<UserResponseObject> {
    return this.userService.signup(userCreateInput);
  }

  @Get('user')
  getCurrentUser(@Request() req): Promise<UserResponseObject> {
    return this.userService.getCurrentUser(req.user);
  }

  @Put('user')
  update(
    @Request() req,
    @Body('user') userUpdateInput: Prisma.UserUpdateInput,
  ): Promise<UserResponseObject> {
    return this.userService.update(req.user, userUpdateInput);
  }
  /*
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }*/
}
