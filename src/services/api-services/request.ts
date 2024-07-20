'use server';
import AppConfiguration from '@/src/config/app.config';
import { ErrorCode } from '@/src/enums/error-codes.enum';
import axios, { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { APIContext, APIOperation } from './common';

const makeRequest = async <T extends APIOperation, R = APIContext[T]['responseType']>(
  options: Omit<APIContext[T], 'responseType'> & { op: T },
): Promise<{ success: true; data: R } | { success: false; errorCode: ErrorCode }> => {
  try {
    const { data, headers } = await axios.post<R>(
      AppConfiguration.get('BASE_URL') + 'api',
      {
        ...options,
      },
      { withCredentials: true },
    );
    headers['set-cookie']?.forEach(cookie => {
      cookies().set(cookie.split('=')[0], cookie.split('=')[1]);
    });

    return { success: true, data };
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
