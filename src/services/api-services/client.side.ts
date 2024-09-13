'use client';
import { variables } from '@/src/config/variables';
import { ErrorCode } from '@/src/enums/error-codes.enum';
import { RequestResponse } from '@/src/types/request-response.type';
import { AxiosError } from 'axios';
import { APIContext, APIOperation } from './common';
import { req } from './utils';

const makeClientSideRequest = async <T extends APIOperation>(
  options: Omit<APIContext[T], 'responseType'> & { op: T },
): Promise<RequestResponse<APIContext[T]['responseType']>> => {
  if (window === undefined) {
    console.error('makeClientSideRequest should only be called client-side');
    return { success: false, errorCode: ErrorCode.API_ERROR };
  }

  try {
    const response = await req<T>(variables.REMOTE_URL, options);

    return { success: true, data: response.data };
  } catch (err) {
    if (!(err instanceof AxiosError)) {
      return { success: false, errorCode: ErrorCode.API_ERROR };
    }

    if (typeof err.response?.data !== 'object') return { success: false, errorCode: ErrorCode.API_ERROR };

    if (typeof err.response.data.error !== 'string') return { success: false, errorCode: ErrorCode.API_ERROR };

    const errorCode = err.response.data.error;

    if (!Object.values(ErrorCode).includes(errorCode)) return { success: false, errorCode: ErrorCode.API_ERROR };

    if (errorCode === ErrorCode.EXPIRED_TOKEN) {
      try {
        const response = await makeClientSideRequest<APIOperation.REFRESH_TOKEN>({ op: APIOperation.REFRESH_TOKEN });
        if (!response.success) {
          return { success: false, errorCode: ErrorCode.EXPIRED_TOKEN };
        }

        return makeClientSideRequest(options);
      } catch {
        return { success: false, errorCode: ErrorCode.API_ERROR };
      }
    }

    return { success: false, errorCode };
  }
};

export { makeClientSideRequest };
