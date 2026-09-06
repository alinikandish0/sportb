import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaOutboxRepository } from './PrismaOutboxRepository';
import { OutboxMessage } from '@platform/messaging';

@Injectable()
export class OutboxPublisher {
  constructor(private readonly repository: PrismaOutboxRepository) {}

  /**
   * مثال استفاده داخل یه service دیگه:
   *
   * await this.prisma.$transaction(async (tx) => {
   *   const user = await tx.user.create({ data: ... });
   *   await this.outboxPublisher.publish(tx, {
   *     aggregateType: 'User',
   *     aggregateId: user.id,
   *     eventType: 'user.registered',
   *     payload: { userId: user.id, email: user.email },
   *   });
   * });
   */
  async publish(
    tx: Prisma.TransactionClient,
    events: OutboxMessage | OutboxMessage[],
  ): Promise<void> {
    const list = Array.isArray(events) ? events : [events];
    for (const event of list) {
      await this.repository.append(tx, event);
    }
  }
}
