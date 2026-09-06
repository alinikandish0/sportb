/**
 * برای backoff دستی بین تلاش‌های مجدد (مثلاً retry roundهای outbox/queue).
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
