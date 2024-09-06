import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { User } from '../../auth/entities';
import { JwtAccessPayload, RequestWithUser } from '../interfaces';
import { Request } from 'express';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.access_key'),
      passReqToCallback: true,
    });
  }

  async validate(
    req: RequestWithUser,
    payload: JwtAccessPayload,
  ): Promise<User> {
    const user: User = await this.userService.validateUserById(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    req.roles = payload.roles;
    return user;
  }
}
