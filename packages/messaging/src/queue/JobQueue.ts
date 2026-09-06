export interface JobQueue<T = unknown> {
  add(jobName: string, data: T, options?: JobQueueOptions): Promise<void>;
}

export interface JobQueueOptions {
  delayMs?: number;
  attempts?: number;
  repeatEveryMs?: number;
}
