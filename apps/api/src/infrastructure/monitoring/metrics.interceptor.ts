import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Histogram } from 'prom-client';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HTTP_REQUEST_DURATION_METRIC } from './metrics.provider';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(
    @InjectMetric(HTTP_REQUEST_DURATION_METRIC)
    private readonly histogram: Histogram<string>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const start = process.hrtime.bigint();

    const record = () => {
      const durationSeconds = Number(process.hrtime.bigint() - start) / 1e9;
      // از route.path استفاده می‌کنیم (مثلاً /auth/:id)، نه url خام —
      // وگرنه هر مقدار متفاوت پارامتر یه label جدا می‌ساخت و cardinality
      // متریک‌ها منفجر می‌شد.
      const route = request.route?.path ?? request.url;

      this.histogram
        .labels(request.method, route, String(response.statusCode))
        .observe(durationSeconds);
    };

    return next.handle().pipe(tap({ next: record, error: record }));
  }
}
