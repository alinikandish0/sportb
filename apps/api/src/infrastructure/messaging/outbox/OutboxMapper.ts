import { Prisma } from '@prisma/client';
import { OutboxMessage } from '@platform/messaging';

export class OutboxMapper {
  static toCreateInput(event: OutboxMessage): Prisma.OutboxMessageCreateInput {
    return {
      aggregateType: event.aggregateType,
      aggregateId: event.aggregateId,
      eventType: event.eventType,
      payload: event.payload as Prisma.InputJsonValue,
    };
  }
}
