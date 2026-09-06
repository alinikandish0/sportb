import { OutboxMessage } from './OutboxMessage';

export type OutboxMessageStatus = 'PENDING' | 'PROCESSED' | 'FAILED';

export interface StoredOutboxMessage<T = unknown> extends OutboxMessage<T> {
  id: string;
  status: OutboxMessageStatus;
  retryCount: number;
  createdAt: Date;
}

/**
 * قرارداد repository برای outbox pattern. جنریک `TTransaction` عمداً باز
 * گذاشته شده چون نوع تراکنش به ORM بستگی داره (مثلاً Prisma.TransactionClient) —
 * این پکیج نباید به هیچ ORM خاصی وابسته باشه.
 */
export interface IOutboxRepository<TTransaction = unknown> {
  append(tx: TTransaction, message: OutboxMessage): Promise<void>;
  findPendingBatch(limit: number): Promise<StoredOutboxMessage[]>;
  markProcessed(id: string): Promise<void>;
  markFailed(id: string, error: string, retryCount: number): Promise<void>;
}
