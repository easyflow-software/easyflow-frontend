'use client';
import { APIOperation } from '@src/services/api-services/common';
import { clientRequest } from '@src/services/api-services/requests/client-side';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const Auth = (): void => {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const refreshToken = async (): Promise<void> => {
      const res = await clientRequest<APIOperation.REFRESH_TOKEN>({ op: APIOperation.REFRESH_TOKEN });
      if (!res.success) {
        router.replace(`/login?callback=${params.get('callback') || '/chat'}`);
        router.refresh();
      } else {
        router.push(params.get('callback') || '/chat');
      }
    };
    void refreshToken();
  }, []);
};

export default Auth;
