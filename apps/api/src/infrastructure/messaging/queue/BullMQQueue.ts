import { Queue } from 'bullmq';
import { JobQueue, JobQueueOptions } from '@platform/messaging';

/**
 * آداپتور generic که interface انتزاعی JobQueue (از packages/messaging) رو
 * با استفاده از یه Queue واقعی BullMQ پیاده‌سازی می‌کنه.
 *
 * برخلاف بقیه‌ی providerها، این کلاس مستقیم @Injectable نیست — چون به یه
 * Queue خاص (نه یه صف ثابت و واحد) وابسته‌ست. برای تزریقش از
 * createBullMQQueueProvider (کنار همین فایل) استفاده کن.
 */
export class BullMQQueue<T = unknown> implements JobQueue<T> {
  constructor(private readonly queue: Queue<T, unknown, string, T, unknown, string>) {}

  async add(jobName: string, data: T, options?: JobQueueOptions): Promise<void> {
    await this.queue.add(jobName, data, {
      delay: options?.delayMs,
      attempts: options?.attempts,
      repeat: options?.repeatEveryMs ? { every: options.repeatEveryMs } : undefined,
    });
  }
}