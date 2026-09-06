import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { httpRequestDurationProvider } from './metrics.provider';
import { MetricsInterceptor } from './metrics.interceptor';

@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
      },
    }),
  ],
  providers: [
    httpRequestDurationProvider,
    { provide: APP_INTERCEPTOR, useClass: MetricsInterceptor },
  ],
})
export class MonitoringModule {}
