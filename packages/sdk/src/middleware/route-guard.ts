import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export interface RouteGuardOptions {
  authRoutes: string[];
  protectedRoutes: string[];
  loginPath?: string;
  defaultAuthRedirect?: string;
}

/**
 * این فقط وجود کوکی رو چک می‌کنه، نه اعتبار خود توکن رو (امضا/انقضا/نقش).
 * اعتبارسنجی واقعی توکن همیشه سمت API انجام میشه (JwtAuthGuard).
 * این تابع فقط برای تجربه‌ی کاربری بهتره: جلوگیری از دیدن صفحه‌ی لاگین وقتی
 * کاربر لاگینه، یا ریدایرکت سریع‌تر به لاگین وقتی هیچ کوکی‌ای نیست.
 * یه کوکی جعلی/منقضی همچنان توسط API رد میشه، پس امنیت واقعی دست‌نخورده می‌مونه.
 */
export function withRouteGuard(request: NextRequest, options: RouteGuardOptions) {
  const {
    authRoutes,
    protectedRoutes,
    loginPath = '/sign',
    defaultAuthRedirect = '/profile',
  } = options;

  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  const hasToken = !!accessToken || !!refreshToken;

  const { pathname } = request.nextUrl;

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (hasToken && isAuthRoute) {
    return NextResponse.redirect(new URL(defaultAuthRedirect, request.url));
  }

  if (!hasToken && isProtectedRoute) {
    const loginUrl = new URL(loginPath, request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
