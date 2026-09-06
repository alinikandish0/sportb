import { Injectable } from '@nestjs/common';
import { OutboxStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { IOutboxRepository, OutboxMessage, StoredOutboxMessage } from '@platform/messaging';
import { OutboxMapper } from './OutboxMapper';

const MAX_RETRIES = 5;

@Injectable()
export class PrismaOutboxRepository
  implements IOutboxRepository<Prisma.TransactionClient>
{
  constructor(private readonly prisma: PrismaService) {}

  /**
   * باید داخل همون تراکنشی صدا زده بشه که تغییر اصلی دیتابیس رو انجام میده
   * (این دقیقاً چیزیه که تضمین اتمیک بودن outbox pattern رو میده)
   */
  async append(tx: Prisma.TransactionClient, event: OutboxMessage): Promise<void> {
    await tx.outboxMessage.create({
      data: OutboxMapper.toCreateInput(event),
    });
  }

  async findPendingBatch(limit = 50): Promise<StoredOutboxMessage[]> {
    return this.prisma.outboxMessage.findMany({
      where: { status: OutboxStatus.PENDING },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
  }

  async markProcessed(id: string): Promise<void> {
    await this.prisma.outboxMessage.update({
      where: { id },
      data: { status: OutboxStatus.PROCESSED, processedAt: new Date() },
    });
  }

  async markFailed(id: string, error: string, retryCount: number): Promise<void> {
    const nextRetryCount = retryCount + 1;
    await this.prisma.outboxMessage.update({
      where: { id },
      data: {
        retryCount: nextRetryCount,
        lastError: error,
        status:
          nextRetryCount >= MAX_RETRIES ? OutboxStatus.FAILED : OutboxStatus.PENDING,
      },
    });
  }
}
