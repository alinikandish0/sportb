// import { INestApplication, VersioningType } from '@nestjs/common';

// export function setupValidation(app: INestApplication): void {
//   app.enableVersioning({
//     type: VersioningType.URI,
//     defaultVersion: '1',
//   });

//   app.setGlobalPrefix('api', {
//     exclude: ['health', 'docs', 'metrics'],
//   });
// }

import { INestApplication, VersioningType } from '@nestjs/common';

export function setupValidation(app: INestApplication): void {
  // توجه: عمداً defaultVersion ست نشده. اگه بذاریمش، همه‌ی controller ها
  // (حتی اونایی که از پکیج‌های خارجی مثل PrometheusModule میان) خودکار
  // نسخه‌دار میشن و دیگه با exclude هم نمیشه جلوشو گرفت.
  // برای ماژول‌های خودمون که نسخه می‌خوایم، مستقیم روی @Controller میذاریم:
  //   @Controller({ path: 'auth', version: '1' })
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.setGlobalPrefix('api', {
    exclude: ['health', 'docs', 'metrics'],
  });
}