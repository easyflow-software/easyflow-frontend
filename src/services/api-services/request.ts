'use server';
import AppConfiguration from '@/src/config/app.config';
import { ErrorCode } from '@/src/enums/error-codes.enum';
import { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { APIContext, APIOperation } from './common';
import { serverSideRequest } from './server-side';

const makeRequest = async <T extends APIOperation>(
  options: Omit<APIContext[T], 'responseType'> & { op: T },
): Promise<{ success: true; data: APIContext[T]['responseType'] } | { success: false; errorCode: ErrorCode }> => {
  try {
    const response = await serverSideRequest<T>(options);

    response.headers['set-cookie']?.map(cookie => {
      const [pair, path, maxAge, httpOnly] = cookie.split(';');
      const [key, value] = pair.split('=');
      cookies().set(key, value, {
        sameSite: 'lax',
        path: path.split('=')[1],
        maxAge: parseInt(maxAge.split('=')[1]),
        httpOnly: httpOnly ? true : false,
        secure: AppConfiguration.get('NODE_ENV') !== 'development',
      });
    });

    return { success: true, data: response.data };
  } catch (err) {
    if (!(err instanceof AxiosError)) return { success: false, errorCode: ErrorCode.API_ERROR };

    if (typeof err.response?.data !== 'object') return { success: false, errorCode: ErrorCode.API_ERROR };

    if (typeof err.response.data.error !== 'string') return { success: false, errorCode: ErrorCode.API_ERROR };

    const errorCode = err.response.data.error;

    if (!Object.values(ErrorCode).includes(errorCode)) return { success: false, errorCode: ErrorCode.API_ERROR };

    if (errorCode === ErrorCode.EXPIRED_TOKEN) {
      console.log('Token expired, refreshing');
      try {
        const response = await makeRequest<APIOperation.REFRESH_TOKEN>({ op: APIOperation.REFRESH_TOKEN });
        if (!response.success) {
          return { success: false, errorCode: ErrorCode.EXPIRED_TOKEN };
        }

        return makeRequest(options);
      } catch (err) {
        return { success: false, errorCode: ErrorCode.API_ERROR };
      }
    }

    return { success: false, errorCode };
  }
};

export { makeRequest };
