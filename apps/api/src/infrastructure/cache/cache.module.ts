import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { createKeyv } from '@keyv/redis';
import { EnvConfig } from '../../config/env.schema';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvConfig, true>) => ({
        stores: createKeyv(configService.get('REDIS_URL', { infer: true })),
        ttl: 60_000, // ۶۰ ثانیه پیش‌فرض؛ هر جا لازم بود override کن
      }),
    }),
  ],
  exports: [CacheModule],
})
export class AppCacheModule {}
