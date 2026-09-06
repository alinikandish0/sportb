import { Provider } from '@nestjs/common';
import { getQueueToken } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { BullMQQueue } from './BullMQQueue';

/**
 * یه provider می‌سازه که JobQueue رو (از packages/messaging) به یه
 * BullMQQueue واقعی، بسته به یه صف مشخص از BullMQ وصل می‌کنه.
 *
 * مثال استفاده توی یه module:
 *   providers: [
 *     createBullMQQueueProvider(QUEUE_NAMES.NOTIFICATION, NOTIFICATION_JOB_QUEUE),
 *   ]
 *
 * و بعد جای دیگه:
 *   constructor(@Inject(NOTIFICATION_JOB_QUEUE) private queue: JobQueue) {}
 */
export function createBullMQQueueProvider(
  queueName: string,
  injectionToken: string,
): Provider {
  return {
    provide: injectionToken,
    inject: [getQueueToken(queueName)],
    useFactory: (queue: Queue) => new BullMQQueue(queue),
  };
}