'use client';

import { ErrorCode } from '@src/enums/error-codes.enum';
import { APIOperation } from '@src/services/api-services/common';
import { clientRequest } from '@src/services/api-services/requests/client-side';
import { LoginType } from '@src/types/login.type';
import { RequestResponse } from '@src/types/request-response.type';
import { UserResponse } from '@src/types/response.types';
import { UserType } from '@src/types/user.type';
import { arrayBufferToBase64, base64ToUint8, generateWrappingKey, hash } from '@src/utils/encryption-utils';

const useLogin = (): {
  initialValues: LoginType;
  login: (values: LoginType) => Promise<RequestResponse<UserResponse>>;
} => {
  const initialValues: LoginType = {
    email: undefined,
    password: undefined,
    turnstileToken: undefined,
  };

  const login = async (values: LoginType): Promise<RequestResponse<UserType>> => {
    const res = await clientRequest<APIOperation.LOGIN>({
      op: APIOperation.LOGIN,
      payload: values,
    });
    if (res.success && values.password) {
      try {
        const ivBuffer = base64ToUint8(res.data.iv);
        const hashedPassword = await hash(values.password, ivBuffer);

        const key = await generateWrappingKey(hashedPassword);

        const randomHash = await hash(res.data.wrappingKeyRandom, ivBuffer);

        const wrappingKey = await generateWrappingKey(randomHash);

        const encryptedWrappingKey = await window.crypto.subtle.wrapKey('raw', key, wrappingKey, {
          name: 'AES-GCM',
          iv: ivBuffer,
        });

        window.localStorage.setItem('wrapping_key', arrayBufferToBase64(encryptedWrappingKey));
      } catch {
        await clientRequest<APIOperation.LOGOUT>({ op: APIOperation.LOGOUT });
        return { success: false, errorCode: ErrorCode.LOCAL_FAILURE };
      }
    }
    return res;
  };

  return { initialValues, login };
};

export default useLogin;
