import { Params } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { EnvConfig } from '../config/env.schema';
import { HTTP_HEADERS } from '../common/constants/http-headers.constants';

export const loggerModuleOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService<EnvConfig, true>): Params => {
    const isProduction = configService.get('NODE_ENV', { infer: true }) === 'production';

    return {
      pinoHttp: {
        level: isProduction ? 'info' : 'debug',
        transport: isProduction
          ? undefined
          : {
              target: 'pino-pretty',
              options: {
                singleLine: true,
                colorize: true,
              },
            },
        redact: ['req.headers.authorization', 'req.headers.cookie'],
        // این همون Correlation ID هست. اینجا (نه یه middleware جدا) درستش
        // می‌کنیم چون genReqId هم می‌تونه هدر ورودی رو بخونه/تولید کنه هم
        // بلافاصله رو response بذاره — همه‌چیز تو یه قدم اتمیک، بدون
        // ریسک اینکه یه middleware جدا با ترتیب اجرای متفاوت یه ID متفاوت
        // بسازه. از این به بعد nestjs-pino خودش (با AsyncLocalStorage)
        // همین id رو به‌صورت خودکار به هر لاگی که هرجای اپ بزنی اضافه
        // می‌کنه — حتی عمیق داخل یه service، بدون اینکه دستی پاسش بدی.
        genReqId: (req, res) => {
          const existing = req.headers[HTTP_HEADERS.REQUEST_ID];
          const id = typeof existing === 'string' ? existing : randomUUID();
          res.setHeader(HTTP_HEADERS.REQUEST_ID, id);
          return id;
        },
      },
    };
  },
};
