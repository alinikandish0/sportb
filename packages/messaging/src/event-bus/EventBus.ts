import { EventPublisher } from './EventPublisher';
import { EventSubscriber } from './EventSubscriber';

/**
 * قرارداد اصلی event bus. هر پیاده‌سازی (EventEmitterBus برای in-process،
 * یا در آینده KafkaBus/RabbitMqBus برای بین‌سرویسی) این interface رو
 * پیاده‌سازی می‌کنه. کد دامنه/اپلیکیشن فقط به این وابسته‌ست، نه به
 * پیاده‌سازی خاص.
 */
export interface EventBus extends EventPublisher, EventSubscriber {}
