import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { CSRF } from './csrf.constants';

/**
 * الگوی double-submit cookie: مطمئن میشه هر کلاینتی یه csrf_token
 * (کوکی غیر httpOnly، برخلاف کوکی‌های auth) داره. جاوااسکریپت سمت
 * فرانت این مقدار رو می‌خونه و توی هدر x-csrf-token برای هر درخواست
 * تغییردهنده (POST/PUT/PATCH/DELETE) می‌فرسته. CsrfGuard چک می‌کنه
 * این دو مقدار یکی هستن.
 *
 * چرا این کار می‌کنه؟ چون یه سایت مخرب می‌تونه یه درخواست cross-site
 * بسازه که کوکی‌ها رو خودکار حمل کنه، ولی نمی‌تونه کوکی csrf ما رو
 * بخونه (به‌خاطر same-origin policy) تا مقدارش رو توی هدر بذاره.
 */
@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const existing = req.cookies?.[CSRF.COOKIE_NAME];

    if (!existing) {
      const token = randomUUID();
      res.cookie(CSRF.COOKIE_NAME, token, {
        httpOnly: false, // عمداً false — باید جاوااسکریپت بتونه بخونتش
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
      });
    }

    next();
  }
}
