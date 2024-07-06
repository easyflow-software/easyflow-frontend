import { ErrorCode } from '@/src/enums/error-codes.enum';
import axios, { AxiosError } from 'axios';
import { APIContext, APIOperation } from './common';

const clientSideRequest = async <T extends APIOperation, R = APIContext[T]['responseType']>(
  options: Omit<APIContext[T], 'responseType'> & { op: T },
): Promise<{ success: true; data: R } | { success: false; errorCode: ErrorCode }> => {
  if (typeof window === 'undefined') throw new Error('Request can only be performed on the client side');

  try {
    const { data } = await axios.post<R>(
      '/api',
      {
        ...options,
      },
      { withCredentials: true },
    );

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

export { clientSideRequest };
