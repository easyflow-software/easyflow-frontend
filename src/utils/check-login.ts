import { APIOperation } from '@src/services/api-services/common';
import serverRequest from '@src/services/api-services/requests/server-side';
import { redirect } from 'next/navigation';

export const checkLogin = async (callback: string): Promise<void> => {
  const res = await serverRequest<APIOperation.CHECK_LOGIN>({ op: APIOperation.CHECK_LOGIN });

  if (!res.success) {
    redirect(`/auth?callback=${callback}`);
  }
};
