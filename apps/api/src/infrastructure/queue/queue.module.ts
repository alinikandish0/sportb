import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import type Redis from 'ioredis';
import { RedisModule } from '../redis/redis.module';
import { REDIS_CLIENT } from '../redis/redis.provider';
import { QUEUE_NAMES } from './queue.constants';
import { NotificationProcessor } from './notification.processor';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [RedisModule],
      inject: [REDIS_CLIENT],
      useFactory: (redis: Redis) => ({
        connection: redis,
      }),
    }),
    BullModule.registerQueue({
      name: QUEUE_NAMES.NOTIFICATION,
    }),
  ],
  providers: [NotificationProcessor],
  exports: [BullModule],
})
export class QueueModule {}