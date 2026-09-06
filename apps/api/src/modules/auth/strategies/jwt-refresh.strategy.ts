import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../../config/env.schema';
import { AUTH_COOKIES } from '../../../common/constants/cookies.constants';

function extractRefreshFromCookie(req: Request): string | null {
  return req?.cookies?.[AUTH_COOKIES.REFRESH_TOKEN] ?? null;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService<EnvConfig, true>) {
    super({
      jwtFromRequest: extractRefreshFromCookie,
      secretOrKey: configService.get('JWT_REFRESH_SECRET', { infer: true }),
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  async validate(req: Request, payload: { sub: string }) {
    const refreshToken = extractRefreshFromCookie(req);
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    return { id: payload.sub, refreshToken };
  }
}
