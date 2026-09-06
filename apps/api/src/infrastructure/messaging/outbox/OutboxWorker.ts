import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { OutboxProcessor } from './OutboxProcessor';
import { QUEUE_NAMES } from '../../queue/queue.constants';

@Processor(QUEUE_NAMES.OUTBOX)
export class OutboxWorker extends WorkerHost {
  constructor(private readonly outboxProcessor: OutboxProcessor) {
    super();
  }

  async process(_job: Job): Promise<void> {
    await this.outboxProcessor.processPendingBatch();
  }
}
