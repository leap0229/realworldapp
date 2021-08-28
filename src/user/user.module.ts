import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from 'src/auth/local.strategy';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get('EXPIRES'),
          issuer: configService.get('ISSUER'),
          audience: configService.get('AUDIENCE'),
        },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    AuthService,
    PrismaService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class UserModule {}
