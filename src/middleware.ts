import i18nConfig from '@/i18n.config';
import { i18nRouter } from 'next-i18n-router';
import { NextRequest, NextResponse } from 'next/server';

const middleware = async (req: NextRequest): Promise<NextResponse> => {
  return i18nRouter(req, i18nConfig);
};

// applies this middleware only to files in the app directory
export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
};

export default middleware;
