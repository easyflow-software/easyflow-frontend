'use client';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ErrorCode } from '../enums/error-codes.enum';
import { clientSideRequest } from '../services/api-services/client-side';
import { APIContext, APIOperation } from '../services/api-services/common';

type useFetchType = {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  fetchDataWithLoadingTimeout: <T extends APIOperation, R = APIContext[T]['responseType']>(
    config: Omit<APIContext[T], 'responseType'> & {
      op: T;
    },
  ) => Promise<
    | {
        success: true;
        data: R;
      }
    | { success: false; errorCode: ErrorCode }
  >;
};

// !IMPORTANT: This hook is for client-side only use the server-side request function for server-side requests
const useFetch = (loadingTimeout = 100): useFetchType => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  let timeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    return () => clearInterval(timeout);
  });

  const fetchDataWithLoadingTimeout = async <T extends APIOperation, R = APIContext[T]['responseType']>(
    config: Omit<APIContext[T], 'responseType'> & { op: T },
  ): Promise<{ success: true; data: R } | { success: false; errorCode: ErrorCode }> => {
    timeout = setTimeout(() => {
      setIsLoading(true);
    }, loadingTimeout);

    const res = await clientSideRequest(config);

    clearInterval(timeout);
    setIsLoading(false);

    // eslint-disable-next-line
    // @ts-ignore
    return res;
  };

  return { isLoading, setIsLoading, fetchDataWithLoadingTimeout };
};

export default useFetch;
