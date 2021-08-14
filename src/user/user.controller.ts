import { Controller, Post, Body } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserResponseObject } from './dto/user.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  signup(
    @Body('user') userCreateInput: Prisma.UserCreateInput,
  ): Promise<UserResponseObject> {
    return this.userService.create(userCreateInput);
  }

  /*@Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }*/
}
