import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getLocaleFromPathname } from '@/lib/locale-helpers';
import { localeForIntl } from '@/lib/localized-routes';

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const pathname = request.nextUrl.pathname;
  requestHeaders.set('x-pathname', pathname);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set('Content-Language', localeForIntl(getLocaleFromPathname(pathname)));
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
