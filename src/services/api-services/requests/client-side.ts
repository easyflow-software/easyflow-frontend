'use client';
import { AxiosError } from 'axios';
import { getSession } from 'next-auth/react';
import AppConfiguration from '../../../config/app.config';
import { APIContext, APIOperation } from '../common';
import { req } from '../utils';
import { RequestResponse } from '@/types/request-response.type';
import { ErrorCode } from '@/enums/error-codes.enum';

const clientRequest = async <T extends APIOperation>(
  options: Omit<APIContext[T], 'responseType'> & { op: T },
): Promise<RequestResponse<APIContext[T]['responseType']>> => {
  try {
    const session = await getSession();
    const response = await req<T>(
      AppConfiguration.get('NEXT_PUBLIC_REMOTE_URL') ?? 'http://localhost:4000/',
      options,
      session,
    );

    return { success: true, data: response.data };
  } catch (err) {
    if (!(err instanceof AxiosError)) {
      return { success: false, errorCode: ErrorCode.API_ERROR };
    }

    if (typeof err.response?.data !== 'object') return { success: false, errorCode: ErrorCode.API_ERROR };

    if (typeof err.response.data.error !== 'string') return { success: false, errorCode: ErrorCode.API_ERROR };

    const errorCode = err.response.data.error;

    if (!Object.values(ErrorCode).includes(errorCode)) return { success: false, errorCode: ErrorCode.API_ERROR };

    return { success: false, errorCode };
  }
};

export { clientRequest };
