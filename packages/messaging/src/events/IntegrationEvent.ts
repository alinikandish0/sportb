import { EventMetadata } from './EventMetadata';

/**
 * IntegrationEvent برای رویدادهایی که قراره از مرز یه سرویس/اپ بیرون بره
 * (مثلاً از api به یه سرویس دیگه، یا از طریق outbox/queue).
 * برخلاف DomainEvent (که در packages/shared تعریف شده و برای رویدادهای
 * داخلی یه aggregate استفاده میشه)، این‌جا payload باید serializable باشه
 * (چون قراره روی شبکه/صف رد و بدل بشه).
 */
export interface IntegrationEvent<T = unknown> {
  readonly eventType: string;
  readonly metadata: EventMetadata;
  readonly payload: T;
}
