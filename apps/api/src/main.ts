import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

import { setupSecurity } from './bootstrap/security';
import { setupSwagger } from './bootstrap/swagger';
import { setupValidation } from './bootstrap/validation';
import { AppModule } from './app/app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));

  setupSecurity(app);
  setupValidation(app);
  setupSwagger(app);

  const globalPrefix = process.env.API_PREFIX ?? 'api';

  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}

bootstrap();
