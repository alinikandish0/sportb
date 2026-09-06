import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule, seconds } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { EnvConfig } from '../../config/env.schema';
import { CsrfGuard } from './csrf.guard';
import { CsrfMiddleware } from './csrf.middleware';
import { CsrfController } from './csrf.controller';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvConfig, true>) => ({
        // محدودیت پیش‌فرض کل اپ: ۱۰۰ درخواست در دقیقه برای هر IP.
        // برای route های حساس (auth) از دکوریتور @AuthThrottle یه سقف
        // سخت‌گیرانه‌تر جداگانه تعریف می‌کنیم.
        throttlers: [{ name: 'default', limit: 100, ttl: seconds(60) }],
        storage: new ThrottlerStorageRedisService(
          configService.get('REDIS_URL', { infer: true }),
        ),
      }),
    }),
  ],
  controllers: [CsrfController],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: CsrfGuard },
  ],
})
export class SecurityModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CsrfMiddleware).forRoutes('*');
  }
}
