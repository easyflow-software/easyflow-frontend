'use server';
import { ErrorCode } from '@/src/enums/error-codes.enum';
import { RequestResponse } from '@/src/types/request-response.type';
import { AxiosError } from 'axios';
import AppConfiguration from '../../config/app.config';
import { APIContext, APIOperation } from './common';
import { req } from './utils';
import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';

const makeServerSideRequest = async <T extends APIOperation>(
  options: Omit<APIContext[T], 'responseType'> & { op: T },
): Promise<RequestResponse<APIContext[T]['responseType']>> => {
  try {
    if (typeof window !== 'undefined') {
      console.error('makeServerSideRequest should only be called server-side');
      return { success: false, errorCode: ErrorCode.API_ERROR };
    }

    const response = await req<T>(AppConfiguration.get('REMOTE_URL'), options, cookies().getAll());

    return {
      success: true,
      data: response.data,
    };
  } catch (err) {
    if (!(err instanceof AxiosError)) {
      console.error(err);
      return { success: false, errorCode: ErrorCode.API_ERROR };
    }

    if (typeof err.response?.data !== 'object') return { success: false, errorCode: ErrorCode.API_ERROR };

    if (typeof err.response.data.error !== 'string') return { success: false, errorCode: ErrorCode.API_ERROR };

    const errorCode = err.response.data.error;

    if (!Object.values(ErrorCode).includes(errorCode)) return { success: false, errorCode: ErrorCode.API_ERROR };

    if (errorCode === ErrorCode.EXPIRED_TOKEN) {
      try {
        redirect('/login?callback=' + encodeURIComponent(headers().get('next-url') ?? '/'));
      } catch {
        return { success: false, errorCode: ErrorCode.API_ERROR };
      }
    }

    return { success: false, errorCode };
  }
};

export { makeServerSideRequest };
