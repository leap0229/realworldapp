import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { ExtJwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      secretOrKey: process.env.TOKEN_SECRET,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Token'),
    });
  }

  async validate(payload: ExtJwtPayload): Promise<any> {
    const { password, ...user } = await this.authService.validateUserById(
      payload.id,
    );

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
