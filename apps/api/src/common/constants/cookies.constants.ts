/**
 * اسم کوکی‌های auth. اینجا یه‌بار تعریف میشه تا هم auth.controller.ts هم
 * هر middleware/guard دیگه‌ای که لازم شد کوکی رو بخونه، یه اسم ثابت
 * و یکسان استفاده کنن (نه رشته‌ی hardcode شده در چند جا).
 */
export const AUTH_COOKIES = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;
