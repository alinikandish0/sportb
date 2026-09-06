import { makeHistogramProvider } from '@willsoto/nestjs-prometheus';

export const HTTP_REQUEST_DURATION_METRIC = 'http_request_duration_seconds';

export const httpRequestDurationProvider = makeHistogramProvider({
  name: HTTP_REQUEST_DURATION_METRIC,
  help: 'مدت‌زمان پاسخ‌دهی به هر HTTP request بر حسب ثانیه',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 3, 5, 10],
});
