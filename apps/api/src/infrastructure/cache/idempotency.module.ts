import { Global, Module } from '@nestjs/common';
import { IdempotencyRepository } from './IdempotencyRepository';
import { IdempotencyInterceptor } from './idempotency.interceptor';

/**
 * Global هست تا هر ماژول دامنه‌ای که بعداً ساختی (booking, payment, ...)
 * بدون نیاز به import اضافه بتونه بنویسه:
 *   @Idempotent()
 *   @UseInterceptors(IdempotencyInterceptor)
 *   @Post(...)
 */
@Global()
@Module({
  providers: [IdempotencyRepository, IdempotencyInterceptor],
  exports: [IdempotencyRepository, IdempotencyInterceptor],
})
export class IdempotencyModule {}
