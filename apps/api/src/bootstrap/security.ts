import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../config/env.schema';

export function setupSecurity(app: INestApplication): void {
  const configService = app.get(ConfigService<EnvConfig, true>);

  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  app.enableCors({
    origin: configService.get('CORS_ORIGIN', { infer: true }),
    credentials: true,
  });
}
