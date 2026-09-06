import { Module, OnModuleInit } from '@nestjs/common';
import { BullModule, InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaOutboxRepository } from './PrismaOutboxRepository';
import { OutboxPublisher } from './OutboxPublisher';
import { OutboxProcessor } from './OutboxProcessor';
import { OutboxWorker } from './OutboxWorker';
import { QUEUE_NAMES } from '../../queue/queue.constants';

const OUTBOX_POLL_JOB = 'outbox-poll';
const OUTBOX_POLL_INTERVAL_MS = 5_000;

@Module({
  imports: [BullModule.registerQueue({ name: QUEUE_NAMES.OUTBOX })],
  providers: [PrismaOutboxRepository, OutboxPublisher, OutboxProcessor, OutboxWorker],
  exports: [OutboxPublisher],
})
export class OutboxModule implements OnModuleInit {
  constructor(@InjectQueue(QUEUE_NAMES.OUTBOX) private readonly outboxQueue: Queue) {}

  async onModuleInit(): Promise<void> {
    // یه repeatable job که هر ۵ ثانیه صف outbox رو poll می‌کنه
    await this.outboxQueue.add(
      OUTBOX_POLL_JOB,
      {},
      {
        repeat: { every: OUTBOX_POLL_INTERVAL_MS },
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }
}



//!! نسخه بهتر با provider 

// import { Module, OnModuleInit, Inject } from '@nestjs/common';
// import { BullModule } from '@nestjs/bullmq';
// import { PrismaOutboxRepository } from './PrismaOutboxRepository';
// import { OutboxPublisher } from './OutboxPublisher';
// import { OutboxProcessor } from './OutboxProcessor';
// import { OutboxWorker } from './OutboxWorker';
// import { QUEUE_NAMES } from '../../queue/queue.constants';
// import { createBullMQQueueProvider } from '../../infrastructure/messaging/queue/bullmq-queue.provider';
// import { JobQueue } from '@platform/messaging';

// // یه توکن اختصاصی برای این صف
// export const OUTBOX_JOB_QUEUE = 'OUTBOX_JOB_QUEUE';

// const OUTBOX_POLL_JOB = 'outbox-poll';
// const OUTBOX_POLL_INTERVAL_MS = 5_000;

// @Module({
//   imports: [BullModule.registerQueue({ name: QUEUE_NAMES.OUTBOX })],
//   providers: [
//     PrismaOutboxRepository,
//     OutboxPublisher,
//     OutboxProcessor,
//     OutboxWorker,
//     // ← آداپتور رو اینجا ثبت می‌کنیم
//     createBullMQQueueProvider(QUEUE_NAMES.OUTBOX, OUTBOX_JOB_QUEUE),
//   ],
//   exports: [OutboxPublisher],
// })
// export class OutboxModule implements OnModuleInit {
//   constructor(
//     @Inject(OUTBOX_JOB_QUEUE) private readonly outboxQueue: JobQueue,
//   ) {}

//   async onModuleInit(): Promise<void> {
//     await this.outboxQueue.add(
//       OUTBOX_POLL_JOB,
//       {},
//       {
//         repeatEveryMs: OUTBOX_POLL_INTERVAL_MS,
//         // توجه: آداپتور فعلی فقط delay و attempts و repeatEveryMs رو پشتیبانی می‌کنه
//         // اگه removeOnComplete / removeOnFail هم لازم داری، باید به آداپتور اضافه بشن
//       },
//     );
//   }
// }