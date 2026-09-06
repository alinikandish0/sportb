import { SetMetadata } from '@nestjs/common';

export const IDEMPOTENT_KEY = 'idempotent';

/**
 * فقط روی endpoint های تغییردهنده‌ی حساس بذار (پرداخت، رزرو، ...) که
 * دوبار اجرا شدنشون (مثلاً به‌خاطر retry شبکه یا دابل‌کلیک کاربر) خطرناکه.
 * کلاینت باید هدر Idempotency-Key رو با یه UUID یکتا برای هر عملیات
 * منطقی بفرسته.
 *
 *   @Idempotent()
 *   @Post('bookings')
 *   createBooking() { ... }
 */
export const Idempotent = () => SetMetadata(IDEMPOTENT_KEY, true);
