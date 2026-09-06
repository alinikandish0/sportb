import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService, TokenPair } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { registerSchema, RegisterDto } from '@platform/contracts';
import { EnvConfig } from '../../config/env.schema';
import { AuthThrottle } from '../../infrastructure/security/auth-throttle.decorator';
import { AUTH_COOKIES } from '../../common/constants/cookies.constants';
import { AuthenticatedUser } from '../../common/types/request-with-user.type';
import { JwtRefreshAuthGuard } from '../../common/guards/jwt-refresh-auth.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<EnvConfig, true>,
  ) {}

  private setAuthCookies(res: Response, tokens: TokenPair): void {
    const isProd =
      this.configService.get('NODE_ENV', { infer: true }) === 'production';
    const base = {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax' as const,
      path: '/',
    };

    res.cookie(AUTH_COOKIES.ACCESS_TOKEN, tokens.accessToken, {
      ...base,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie(AUTH_COOKIES.REFRESH_TOKEN, tokens.refreshToken, {
      ...base,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  @AuthThrottle()
  @Post('register')
  async register(
    @Body(new ZodValidationPipe(registerSchema)) body: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.register(body.email, body.password);
    const tokens = await this.authService.issueTokens(user.id, user.email);
    this.setAuthCookies(res, tokens);
    return { id: user.id, email: user.email };
  }

  @AuthThrottle()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.issueTokens(user.id, user.email);
    this.setAuthCookies(res, tokens);
    return { id: user.id, email: user.email };
  }

  @AuthThrottle()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @CurrentUser() user: { id: string; refreshToken: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refresh(
      user.refreshToken,
      user.id,
    );
    this.setAuthCookies(res, tokens);
    return { success: true };
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser() user: { id: string; refreshToken: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user.id, user.refreshToken);
    res.clearCookie(AUTH_COOKIES.ACCESS_TOKEN);
    res.clearCookie(AUTH_COOKIES.REFRESH_TOKEN);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }
}
