import { ZodType, z } from 'zod';

/**
 * یه factory عمومی برای اعتبارسنجی متغیرهای محیطی با Zod.
 * هر اپ (api, web, admin, ...) schema خودش رو تعریف می‌کنه و از این تابع استفاده می‌کنه
 * تا پیام خطای یکسان و خوانا داشته باشیم، به‌جای تکرار همون منطق try/catch توی هر اپ.
 *
 * مثال استفاده:
 *   const envSchema = z.object({ PORT: z.coerce.number() });
 *   export const validateEnv = createEnvValidator(envSchema);
 */
export function createEnvValidator<T extends ZodType>(schema: T) {
  return (config: Record<string, unknown>): z.infer<T> => {
    const result = schema.safeParse(config);

    if (!result.success) {
      const formatted = result.error.issues
        .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
        .join('\n');
      throw new Error(`❌ Invalid environment variables:\n${formatted}`);
    }

    return result.data;
  };
}
