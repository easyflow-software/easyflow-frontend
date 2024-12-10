'use client';

import { ErrorCode } from '@src/enums/error-codes.enum';
import { APIOperation } from '@src/services/api-services/common';
import { clientRequest } from '@src/services/api-services/requests/client-side';
import { User } from '@src/types/user.type';
import {
  arrayBufferToBase64,
  generateSymetricKey,
  getRandomValues,
  retrivePublicKey,
  wrapKey,
} from '@src/utils/encryption-utils';
import { useState } from 'react';

const useChat = (): {
  isLoading: boolean;
  error?: ErrorCode;
  createChat: (user: User[], name?: string, description?: string) => Promise<void>;
} => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorCode>();

  async function encryptChatKey(userKey: string, key: CryptoKey): Promise<string> {
    const publicKey = await retrivePublicKey(userKey);

    const ivBuffer = getRandomValues();

    const wrapedKey = await wrapKey(key, publicKey, ivBuffer);

    return arrayBufferToBase64(wrapedKey);
  }

  const createChat = async (users: User[], name?: string, description?: string): Promise<void> => {
    setIsLoading(true);
    const chatKey = await generateSymetricKey();
    const userKeys: { userId: string; key: string }[] = [];
    users.forEach(async user => {
      const wrapedKey = await encryptChatKey(user.publicKey, chatKey);
      userKeys.push({ userId: user.id, key: wrapedKey });
    });

    const res = await clientRequest<APIOperation.CREATE_CHAT>({
      op: APIOperation.CREATE_CHAT,
      payload: { name, description, userKeys },
    });

    if (!res.success) {
      setError(res.errorCode);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  return { isLoading, error, createChat };
};

export default useChat;
