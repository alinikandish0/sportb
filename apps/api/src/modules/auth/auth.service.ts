import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RefreshTokenRepository } from './refresh-token.repository';
import { TokenRevocationService } from './token-revocation.service';
import { EnvConfig } from '../../config/env.schema';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvConfig, true>,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly revocationService: TokenRevocationService,
  ) {}

  async register(email: string, password: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('این ایمیل قبلاً ثبت شده');
    }

    const passwordHash = await argon2.hash(password);
    return this.prisma.user.create({ data: { email, passwordHash } });
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const valid = await argon2.verify(user.passwordHash, password);
    if (!valid) return null;

    return user;
  }

  async issueTokens(userId: string, email: string): Promise<TokenPair> {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, email },
      {
        secret: this.configService.get('JWT_ACCESS_SECRET', { infer: true }),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN', {
          infer: true,
        }),
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: userId },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET', { infer: true }),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', {
          infer: true,
        }),
      },
    );

    const decoded = this.jwtService.decode<{ exp: number }>(refreshToken);
    await this.refreshTokenRepository.create(
      userId,
      refreshToken,
      new Date(decoded.exp * 1000),
    );

    return { accessToken, refreshToken };
  }

  async refresh(oldRefreshToken: string, userId: string): Promise<TokenPair> {
    const tokenHash = this.refreshTokenRepository.hashToken(oldRefreshToken);

    if (await this.revocationService.isRevoked(tokenHash)) {
      throw new UnauthorizedException('این توکن باطل شده');
    }

    const stored =
      await this.refreshTokenRepository.findValidByToken(oldRefreshToken);
    if (!stored) {
      throw new UnauthorizedException('رفرش توکن نامعتبره');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException();
    }

    // token rotation: قدیمی رو باطل می‌کنیم، یکی جدید صادر می‌کنیم
    await this.refreshTokenRepository.revoke(stored.id);
    const ttl = Math.max(
      Math.floor((stored.expiresAt.getTime() - Date.now()) / 1000),
      1,
    );
    await this.revocationService.revoke(tokenHash, ttl);

    return this.issueTokens(user.id, user.email);
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    const tokenHash = this.refreshTokenRepository.hashToken(refreshToken);
    const stored =
      await this.refreshTokenRepository.findValidByToken(refreshToken);

    if (stored) {
      await this.refreshTokenRepository.revoke(stored.id);
      const ttl = Math.max(
        Math.floor((stored.expiresAt.getTime() - Date.now()) / 1000),
        1,
      );
      await this.revocationService.revoke(tokenHash, ttl);
    }
  }
}
