export interface OutboxMessage<T = unknown> {
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  payload: T;
}
