import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenTypeEnum } from './enum/token-type.enum';
import { JwtRefreshPayload } from '../common/interfaces';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  public generateToken(
    payload: JwtRefreshPayload,
    type: TokenTypeEnum,
  ): string {
    let secretKey: string;
    switch (type) {
      case TokenTypeEnum.ACCESS:
        secretKey = this.configService.get('jwt.access_key');
        break;
      case TokenTypeEnum.REFRESH:
        secretKey = this.configService.get('jwt.refresh_key');
        break;
      case TokenTypeEnum.EMAIL:
        secretKey = this.configService.get('jwt.email_key');
        break;
      default:
        throw new Error('Invalid token type');
    }
    const expiresIn: string = type === TokenTypeEnum.REFRESH ? '30d' : '30m';
    return this.jwtService.sign(payload, { secret: secretKey, expiresIn });
  }

  public verify(token: string, secret: string): any {
    return this.jwtService.verify(token, { secret });
  }
}
