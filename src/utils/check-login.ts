import { APIOperation } from '@/services/api-services/common';
import serverRequest from '@/services/api-services/requests/server-side';
import { redirect } from 'next/navigation';

export const checkLogin = async (callback: string): Promise<void> => {
  const res = await serverRequest<APIOperation.CHECK_LOGIN>({ op: APIOperation.CHECK_LOGIN });

  if (!res.success || !res.data) {
    redirect(`/auth?callback=${callback}`);
  }
};
