import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IDEMPOTENT_KEY } from './idempotency.decorator';
import {
  IdempotencyRepository,
  UniqueConstraintViolationError,
} from './IdempotencyRepository';

const IDEMPOTENCY_HEADER = 'idempotency-key';

/**
 * برخلاف نسخه‌ی اول (که Redis-based بود و فقط بر اساس idempotency-key
 * خام کلید می‌خورد)، این نسخه:
 *   ۱. دائمیه (Postgres، نه یه TTL موقت روی Redis)
 *   ۲. به ازای هر کاربر جدا کلید می‌خوره (userId + key) — یعنی دو کاربر
 *      مختلف که تصادفاً یه idempotency-key یکسان بفرستن، پاسخ همدیگه رو
 *      نمی‌گیرن
 *   ۳. race condition واقعی (چند درخواست کاملاً همزمان با یه کلید) رو
 *      با unique constraint دیتابیس مدیریت می‌کنه، نه فقط یه چک ساده
 *      قبل از نوشتن (که race داشت)
 *
 * نکته‌ی مهم برای استفاده‌ی درست: این تضمین می‌کنه *پاسخی که کلاینت
 * می‌بینه* یکسانه، نه اینکه handler دقیقاً فقط یه‌بار اجرا بشه (بدون
 * distributed lock، تحت concurrency واقعی ممکنه handler چندبار اجرا
 * بشه ولی فقط نتیجه‌ی یکی از اونا ذخیره/برگردونده بشه). برای اکثر
 * موارد (رزرو، پرداخت) این کافیه؛ اگه handler side-effect غیرقابل‌برگشت
 * داشت (مثلاً واقعاً شارژ کردن یه کارت)، خودِ handler هم باید idempotent
 * طراحی بشه.
 */
@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly repository: IdempotencyRepository,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const isIdempotent = this.reflector.get<boolean>(
      IDEMPOTENT_KEY,
      context.getHandler(),
    );
    if (!isIdempotent) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const idempotencyKey = request.headers[IDEMPOTENCY_HEADER];

    if (!idempotencyKey || typeof idempotencyKey !== 'string') {
      throw new BadRequestException(
        `این عملیات نیاز به هدر ${IDEMPOTENCY_HEADER} داره (یه UUID یکتا برای هر عملیات)`,
      );
    }

    const userId = request.user?.id;
    if (!userId) {
      throw new UnauthorizedException(
        'Idempotency فقط برای درخواست‌های احراز‌هویت‌شده کار می‌کنه (این guard باید بعد از JwtAuthGuard بیاد)',
      );
    }

    return this.handleIdempotent(userId, idempotencyKey, next);
  }

  private handleIdempotent(
    userId: string,
    key: string,
    next: CallHandler,
  ): Observable<unknown> {
    return new Observable((subscriber) => {
      this.repository
        .find(userId, key)
        .then((existing) => {
          if (existing) {
            subscriber.next(existing.response);
            subscriber.complete();
            return;
          }

          next
            .handle()
            .pipe(
              switchMap(async (response) => {
                try {
                  await this.repository.create(userId, key, response);
                  return response;
                } catch (error) {
                  if (error instanceof UniqueConstraintViolationError) {
                    // یه درخواست موازی برنده شد؛ نتیجه‌ی همونو برگردون
                    const winner = await this.repository.find(userId, key);
                    if (winner) return winner.response;
                  }
                  throw error;
                }
              }),
            )
            .subscribe({
              next: (value) => {
                subscriber.next(value);
                subscriber.complete();
              },
              error: (error) => subscriber.error(error),
            });
        })
        .catch((error) => subscriber.error(error));
    });
  }
}
