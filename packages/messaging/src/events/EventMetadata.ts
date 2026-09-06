export interface EventMetadata {
  readonly eventId: string;
  readonly occurredAt: Date;
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly source?: string;
}
