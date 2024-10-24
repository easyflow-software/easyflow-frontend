import { auth } from '@/auth';
import AppConfiguration from '@/config/app.config';
import { ErrorCode } from '@/enums/error-codes.enum';
import { RequestResponse } from '@/types/request-response.type';
import { AxiosError } from 'axios';
import { APIOperation, APIContext } from '../common';
import { req } from '../utils';

const serverRequest = async <T extends APIOperation>(
  options: Omit<APIContext[T], 'responseType'> & { op: T },
): Promise<RequestResponse<APIContext[T]['responseType']>> => {
  try {
    const session = await auth();
    const response = await req<T>(
      AppConfiguration.get('NEXT_PUBLIC_REMOTE_URL'),
      // Add Origin header to the request to comply with CORS policy
      { ...options, headers: { ...options.headers, Origin: AppConfiguration.get('NEXT_PUBLIC_BASE_URL') } },
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

export default serverRequest;
