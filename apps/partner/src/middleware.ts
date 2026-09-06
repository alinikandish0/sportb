import type { NextRequest } from 'next/server';
import { withRouteGuard } from '@platform/sdk';

export function middleware(request: NextRequest) {
  return withRouteGuard(request, {
    authRoutes: ['/sign'],
    protectedRoutes: ['/dashboard'],
    loginPath: '/sign',
    defaultAuthRedirect: '/dashboard',
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
