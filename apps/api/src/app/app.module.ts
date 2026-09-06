import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../infrastructure/prisma/prisma.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { loggerModuleOptions } from '../bootstrap/logger';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { validateEnv } from '../config/env.schema';
import { ConfigModule } from '@nestjs/config';
import { AppCacheModule } from '../infrastructure/cache/cache.module';
import { QueueModule } from '../infrastructure/queue/queue.module';
import { OutboxModule } from '../infrastructure/messaging/outbox/OutboxModule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from '../modules/auth/auth.module';
import { EventBusModule } from '../infrastructure/messaging/event-bus/EventBusModule';
import { StorageModule } from '../infrastructure/storage/storage.module';
import { MailModule } from '../infrastructure/mail/mail.module';
import { MonitoringModule } from '../infrastructure/monitoring/monitoring.module';
import { RedisModule } from '../infrastructure/redis/redis.module';
import { SecurityModule } from '../infrastructure/security/security.module';
import { IdempotencyModule } from '../infrastructure/cache/idempotency.module';

@Module({
    imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    LoggerModule.forRootAsync(loggerModuleOptions),
    EventEmitterModule.forRoot(),
    SecurityModule,
    PrismaModule,
    RedisModule,
    AppCacheModule,
    QueueModule,
    OutboxModule,
    EventBusModule,
    StorageModule,
    MailModule,
    MonitoringModule,
    AuthModule,
    IdempotencyModule
  ],
  controllers: [AppController],
  providers: [AppService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },

  ],
})
export class AppModule {}
