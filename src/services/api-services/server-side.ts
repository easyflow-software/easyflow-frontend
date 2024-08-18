'use server';
import { ErrorCode } from '@/src/enums/error-codes.enum';
import { RequestResponse } from '@/src/types/request-response.type';
import { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import AppConfiguration from '../../config/app.config';
import { APIContext, APIOperation } from './common';
import { req } from './utils';

const makeServerSideRequest = async <T extends APIOperation>(
  options: Omit<APIContext[T], 'responseType'> & { op: T },
): Promise<RequestResponse<APIContext[T]['responseType']>> => {
  try {
    const response = await req<T>(AppConfiguration.get('REMOTE_URL'), options, cookies().getAll());

    response.headers['set-cookie']?.map(cookie => {
      const [pair, path, maxAge, httpOnly] = cookie.split(';');
      const [key, value] = pair.split('=');
      cookies().set(key, value, { path, maxAge: parseInt(maxAge.split('=')[1]), httpOnly: httpOnly === 'HttpOnly' });
    });

    return { success: true, data: response.data };
  } catch (err) {
    if (!(err instanceof AxiosError)) return { success: false, errorCode: ErrorCode.API_ERROR };

    if (typeof err.response?.data !== 'object') return { success: false, errorCode: ErrorCode.API_ERROR };

    if (typeof err.response.data.error !== 'string') return { success: false, errorCode: ErrorCode.API_ERROR };

    const errorCode = err.response.data.error;

    if (!Object.values(ErrorCode).includes(errorCode)) return { success: false, errorCode: ErrorCode.API_ERROR };

    if (errorCode === ErrorCode.EXPIRED_TOKEN) {
      try {
        const response = await makeServerSideRequest<APIOperation.REFRESH_TOKEN>({ op: APIOperation.REFRESH_TOKEN });
        if (!response.success) {
          return { success: false, errorCode: ErrorCode.EXPIRED_TOKEN };
        }

        return makeServerSideRequest(options);
      } catch {
        return { success: false, errorCode: ErrorCode.API_ERROR };
      }
    }

    return { success: false, errorCode };
  }
};

export { makeServerSideRequest };
