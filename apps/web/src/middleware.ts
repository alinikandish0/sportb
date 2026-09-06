import type { NextRequest } from 'next/server';
import { withRouteGuard } from '@platform/sdk';

export function middleware(request: NextRequest) {
  return withRouteGuard(request, {
    authRoutes: ['/sign'],
    protectedRoutes: ['/profile', '/dashboard'],
    loginPath: '/sign',
    defaultAuthRedirect: '/profile',
  });
}

export const config = {
  // میدل‌ور رو روی همه‌چیز اجرا کن، به جز فایل‌های استاتیک و api
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
