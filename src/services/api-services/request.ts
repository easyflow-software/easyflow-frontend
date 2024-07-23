'use server';
import { ErrorCode } from '@/src/enums/error-codes.enum';
import { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { APIContext, APIOperation } from './common';
import { serverSideRequest } from './server-side';

const makeRequest = async <T extends APIOperation, R = APIContext[T]['responseType']>(
  options: Omit<APIContext[T], 'responseType'> & { op: T },
): Promise<{ success: true; data: R } | { success: false; errorCode: ErrorCode }> => {
  try {
    const response = await serverSideRequest<T, R>(options);

    response.headers['set-cookie']?.map(cookie => {
      const [key, value] = cookie.split('=');
      cookies().set(key, value, { sameSite: 'lax' });
    });

    return { success: true, data: response.data };
  } catch (err) {
    if (!(err instanceof AxiosError)) return { success: false, errorCode: ErrorCode.API_ERROR };

    if (typeof err.response?.data !== 'object') return { success: false, errorCode: ErrorCode.API_ERROR };

    if (typeof err.response.data.error !== 'string') return { success: false, errorCode: ErrorCode.API_ERROR };

    const errorCode = err.response.data.error;

    if (!Object.values(ErrorCode).includes(errorCode)) return { success: false, errorCode: ErrorCode.API_ERROR };

    return { success: false, errorCode };
  }
};

export { makeRequest };
