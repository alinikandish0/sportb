import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventBus } from '@platform/messaging';

/**
 * پیاده‌سازی in-process (داخل همون پروسه) روی EventEmitter2.
 * قرارداد EventBus از packages/messaging میاد (نه یه interface محلی) —
 * یعنی اگه یه سرویس دیگه (یا حتی زبان دیگه با همین قرارداد) لازم شد،
 * فقط کافیه یه پیاده‌سازی جدید (مثلاً KafkaBus) بسازیم که همین EventBus
 * رو implement کنه، بدون اینکه کدی که ازش استفاده می‌کنه عوض بشه.
 */
@Injectable()
export class EventEmitterBus implements EventBus {
  constructor(private readonly emitter: EventEmitter2) {}

  async publish<T = unknown>(eventName: string, payload: T): Promise<void> {
    await this.emitter.emitAsync(eventName, payload);
  }

  subscribe<T = unknown>(
    eventName: string,
    handler: (payload: T) => void | Promise<void>,
  ): void {
    this.emitter.on(eventName, handler);
  }
}
