export interface EventSubscriber {
  subscribe<T = unknown>(
    eventName: string,
    handler: (payload: T) => void | Promise<void>,
  ): void;
}
