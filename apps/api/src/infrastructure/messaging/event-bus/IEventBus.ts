export interface IEventBus {
  publish<T = unknown>(eventName: string, payload: T): Promise<void>;
  subscribe<T = unknown>(
    eventName: string,
    handler: (payload: T) => void | Promise<void>,
  ): void;
}
