import i18nConfig from '@/i18n.config';
import { i18nRouter } from 'next-i18n-router';
import { NextRequest, NextResponse } from 'next/server';

const middleware = async (request: NextRequest): Promise<NextResponse> => {
  return i18nRouter(request, i18nConfig);
};

// applies this middleware only to files in the app directory
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
    },
  ],
};

export default middleware;
