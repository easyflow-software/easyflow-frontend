import i18nConfig from '@/i18n.config';
import { i18nRouter } from 'next-i18n-router';
import { NextRequest, NextResponse } from 'next/server';

const middleware = async (req: NextRequest): Promise<NextResponse> => {
  // Security headers
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = `
      default-src 'self' '*.easyflow.chat';
      script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: http: 'unsafe-inline' ${
        process.env.NODE_ENV === 'production' ? '' : `'unsafe-eval'`
      };
      style-src 'self' 'nonce-${nonce}';
      img-src 'self' blob: data:;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
  `;
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, ' ').trim();

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

  // i18n language setting and detection
  return i18nRouter(req, i18nConfig);
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
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};

export default middleware;
