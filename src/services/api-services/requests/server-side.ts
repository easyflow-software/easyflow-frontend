import AppConfiguration from '@src/config/app.config';
import { ErrorCode } from '@src/enums/error-codes.enum';
import { RequestResponse } from '@src/types/request-response.type';
import { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { APIContext, APIOperation } from '../common';
import { req } from '../utils';

const serverRequest = async <T extends APIOperation>(
  options: Omit<APIContext[T], 'responseType'> & { op: T },
): Promise<RequestResponse<APIContext[T]['responseType']>> => {
  try {
    const cookieStore = (await cookies()).getAll();
    const response = await req<T>(
      AppConfiguration.get('NEXT_PUBLIC_REMOTE_URL'),
      // Add Origin header to the request to comply with CORS policy
      { ...options, headers: { ...options.headers, Origin: AppConfiguration.get('NEXT_PUBLIC_BASE_URL') } },
      cookieStore,
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

export default serverRequest;
