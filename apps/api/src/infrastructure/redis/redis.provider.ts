import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { EnvConfig } from '../../config/env.schema';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  inject: [ConfigService],
  useFactory: (configService: ConfigService<EnvConfig, true>): Redis => {
    return new Redis(configService.get('REDIS_URL', { infer: true }), {
      // BullMQ به این تنظیم برای اتصالات blocking نیاز داره
      maxRetriesPerRequest: null,
    });
  },
};
