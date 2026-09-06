import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * برای وقتی که خواستی correlation id رو مستقیم توی یه controller بخونی
 * (مثلاً برای گذاشتن توی metadata یه outbox event). خودِ id از قبل توسط
 * genReqId (توی bootstrap/logger.ts) روی request ست شده — اینجا فقط
 * می‌خونیمش، دوباره تولیدش نمی‌کنیم.
 *
 * مثال:
 *   create(@CorrelationId() correlationId: string) { ... }
 */
export const CorrelationId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.id;
  },
);
