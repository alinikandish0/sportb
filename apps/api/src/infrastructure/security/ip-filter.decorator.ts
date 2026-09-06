import { SetMetadata } from '@nestjs/common';

export const IP_ALLOWLIST_KEY = 'ipAllowlist';

/**
 * فقط روی route/controller هایی که واقعاً لازمه بذار (مثلاً یه endpoint
 * داخلی یا مدیریتی حساس). بقیه‌ی route ها دست‌نخورده و بدون محدودیت
 * می‌مونن. باید همراه با IpFilterGuard استفاده بشه:
 *
 *   @RestrictIp('1.2.3.4', '5.6.7.8')
 *   @UseGuards(IpFilterGuard)
 *   @Get('internal-report')
 */
export const RestrictIp = (...ips: string[]) => SetMetadata(IP_ALLOWLIST_KEY, ips);
