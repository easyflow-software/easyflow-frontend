'use client';
import { APIOperation } from '@/services/api-services/common';
import { clientRequest } from '@/services/api-services/requests/client-side';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const Auth = (): void => {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const refreshToken = async (): Promise<void> => {
      const res = await clientRequest<APIOperation.REFRESH_TOKEN>({ op: APIOperation.REFRESH_TOKEN });
      if (!res.success) {
        router.push('/login');
      } else {
        router.push(params.get('callback') || '/chat');
      }
    };
    void refreshToken();
  }, []);
};

export default Auth;
