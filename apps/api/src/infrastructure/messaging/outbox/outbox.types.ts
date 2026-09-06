export interface OutboxEvent<T = unknown> {
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  payload: T;
}
