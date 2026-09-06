import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

/**
 * کش کردن response یه GET endpoint توی Redis برای مدت مشخص.
 * فقط برای route هایی استفاده کن که خروجیشون شخصی‌سازی‌شده نیست
 * (چون کش بر اساس URL کامل ذخیره میشه، نه بر اساس کاربر لاگین‌شده) —
 * مثلاً یه لیست عمومی، نه چیزی مثل /auth/me.
 *
 * مثال:
 *   @HttpCache(60_000) // ۱ دقیقه
 *   @Get('coaches')
 *   listCoaches() { ... }
 */
export function HttpCache(ttlMs: number) {
  return applyDecorators(UseInterceptors(CacheInterceptor), CacheTTL(ttlMs));
}
