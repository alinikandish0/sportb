import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { HTTP_HEADERS } from '../constants/http-headers.constants';

/**
 * یه request id به هر درخواست ورودی اضافه می‌کنه (یا اگه از پشت یه
 * reverse proxy/سرویس دیگه اومده باشه با هدر x-request-id، همون رو
 * حفظ می‌کنه). برای ردیابی یه درخواست توی لاگ‌ها (pino) وقتی چندتا
 * سرویس/instance درگیرن خیلی به‌درد می‌خوره.
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const existing = req.headers[HTTP_HEADERS.REQUEST_ID];
    const requestId = typeof existing === 'string' ? existing : randomUUID();

    req.headers[HTTP_HEADERS.REQUEST_ID] = requestId;
    res.setHeader(HTTP_HEADERS.REQUEST_ID, requestId);

    next();
  }
}
