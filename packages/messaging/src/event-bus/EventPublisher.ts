export interface EventPublisher {
  publish<T = unknown>(eventName: string, payload: T): Promise<void>;
}
