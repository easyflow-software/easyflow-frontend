'use server';

import { APIOperation } from '@/src/services/api-services/common';
import { makeRequest } from '@/src/services/api-services/request';
import { RequestResponse } from '@/src/types/request-response.type';
import { UserResponse } from '@/src/types/response.types';

export const login = async (email: string, password: string): Promise<RequestResponse<UserResponse>> => {
  const res = await makeRequest<APIOperation.LOGIN>({
    op: APIOperation.LOGIN,
    payload: { email, password },
  });
  return res;
};
