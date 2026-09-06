import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaOutboxRepository } from './PrismaOutboxRepository';

@Injectable()
export class OutboxProcessor {
  private readonly logger = new Logger(OutboxProcessor.name);

  constructor(
    private readonly repository: PrismaOutboxRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async processPendingBatch(limit = 50): Promise<void> {
    const pending = await this.repository.findPendingBatch(limit);

    for (const message of pending) {
      try {
        await this.eventEmitter.emitAsync(message.eventType, {
          aggregateType: message.aggregateType,
          aggregateId: message.aggregateId,
          payload: message.payload,
        });
        await this.repository.markProcessed(message.id);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.logger.error(
          `Failed to process outbox message ${message.id}: ${errorMessage}`,
        );
        await this.repository.markFailed(message.id, errorMessage, message.retryCount);
      }
    }
  }
}
