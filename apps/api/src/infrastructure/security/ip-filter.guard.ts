import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IP_ALLOWLIST_KEY } from './ip-filter.decorator';

@Injectable()
export class IpFilterGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowlist = this.reflector.getAllAndOverride<string[]>(IP_ALLOWLIST_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // اگه route هیچ allowlist ای نداره، یعنی محدودیتی نمی‌خواد
    if (!allowlist || allowlist.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const clientIp = this.getClientIp(request);

    if (!allowlist.includes(clientIp)) {
      throw new ForbiddenException('دسترسی از این IP مجاز نیست');
    }

    return true;
  }

  private getClientIp(request: Request): string {
    // چون پشت nginx هستیم، IP واقعی کلاینت تو این هدر میاد، نه request.ip
    // (که IP خودِ nginx رو نشون میده)
    const forwarded = request.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.length > 0) {
      return forwarded.split(',')[0].trim();
    }
    return request.ip ?? '';
  }
}
