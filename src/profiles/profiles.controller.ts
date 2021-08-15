import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @Get(':username')
  getProfile(@Request() req, @Param('username') username: string) {
    return this.profilesService.getProfile(req.user, username);
  }

  @Post(':username/follow')
  @HttpCode(200)
  followUser(@Request() req, @Param('username') username: string) {
    return this.profilesService.followUser(req.user, username);
  }

  @Delete(':username/follow')
  unFollowUser(@Request() req, @Param('username') username: string) {
    return this.profilesService.unFollowUser(req.user, username);
  }
}
