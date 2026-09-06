import type { NextRequest } from 'next/server';
import { withRouteGuard } from '@platform/sdk';

export function middleware(request: NextRequest) {
  return withRouteGuard(request, {
    authRoutes: ['/sign'],
    // هر مسیر جدیدی که به پنل ادمین اضافه کردی (dashboard, users, ...) رو اینجا اضافه کن.
    // عمداً از '/' استفاده نکردیم چون باعث میشه خود '/sign' هم "protected" حساب بشه
    // و توی یه حلقه‌ی ریدایرکت گیر کنه.
    protectedRoutes: ['/dashboard'],
    loginPath: '/sign',
    defaultAuthRedirect: '/dashboard',
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
