import { Throttle, seconds } from '@nestjs/throttler';

/**
 * محدودیت سخت‌گیرانه برای endpoint های حساس auth (login, register, refresh)
 * تا جلوی brute-force گرفته بشه: حداکثر ۵ درخواست در هر ۶۰ ثانیه، به‌جای
 * سقف پیش‌فرض ۱۰۰ که برای کل اپ تنظیم کردیم.
 */
export const AuthThrottle = () =>
  Throttle({ default: { limit: 5, ttl: seconds(60) } });
