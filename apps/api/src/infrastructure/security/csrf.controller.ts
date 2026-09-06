import { Controller, Get } from '@nestjs/common';

/**
 * فرانت‌اند قبل از هر عملیات تغییردهنده (POST/PUT/PATCH/DELETE)، یه‌بار
 * این endpoint رو صدا می‌زنه (مثلاً موقع بالا اومدن اپ) تا کوکی csrf_token
 * رو بگیره. چون این یه GET ساده‌ست، CsrfGuard خودکار اجازه‌ی عبور میده
 * و CsrfMiddleware کوکی رو (اگه از قبل نداشته) ست می‌کنه.
 */
@Controller({ path: 'csrf', version: '1' })
export class CsrfController {
  @Get()
  warmup(): { ok: true } {
    return { ok: true };
  }
}
