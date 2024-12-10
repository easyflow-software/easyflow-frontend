'use client';

import { ErrorCode } from '@src/enums/error-codes.enum';
import { APIOperation } from '@src/services/api-services/common';
import { clientRequest } from '@src/services/api-services/requests/client-side';
import { Login } from '@src/types/login.type';
import { arrayBufferToBase64, base64ToUint8, generateWrapingKey, hash } from '@src/utils/encryption-utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { UserContext } from '../providers/user-provider/UserProvider';

const useLogin = (): {
  initialValues: Login;
  error?: ErrorCode;
  isLoading: boolean;
  setError: Dispatch<SetStateAction<ErrorCode | undefined>>;
  login: (values: Login) => Promise<void>;
} => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { refetchUser } = useContext(UserContext);

  const [error, setError] = useState<ErrorCode>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const initialValues: Login = {
    email: undefined,
    password: undefined,
    turnstileToken: undefined,
  };

  const login = async (values: Login): Promise<void> => {
    setIsLoading(true);
    const res = await clientRequest<APIOperation.LOGIN>({
      op: APIOperation.LOGIN,
      payload: values,
    });
    if (res.success && values.password) {
      try {
        const ivBuffer = base64ToUint8(res.data.iv);
        const hashedPassword = await hash(values.password, ivBuffer);

        const key = await generateWrapingKey(hashedPassword);

        const randomHash = await hash(res.data.wrapingKeyRandom, ivBuffer);

        const wrapingKey = await generateWrapingKey(randomHash);

        const encryptedWrapingKey = await window.crypto.subtle.wrapKey('raw', key, wrapingKey, {
          name: 'AES-GCM',
          iv: ivBuffer,
        });

        window.localStorage.setItem('wraping_key', arrayBufferToBase64(encryptedWrapingKey));
      } catch {
        const res = await clientRequest<APIOperation.LOGOUT>({ op: APIOperation.LOGOUT });
        if (!res.success) {
          setError(ErrorCode.FAILED_TO_RECOVER);
          return;
        }
      }
    }

    if (res.success) {
      void refetchUser();
      router.replace(searchParams.get('callback') ?? '/chat');
      router.refresh();
      return;
    } else {
      setError(res.errorCode);
      setIsLoading(false);
      return;
    }
  };

  return { initialValues, error, isLoading, setError, login };
};

export default useLogin;
