'use server';

import { APIOperation } from '@/src/services/api-services/common';
import { makeRequest } from '@/src/services/api-services/request';
import { RequestResponse } from '@/src/types/request-response.type';
import { SignupResponse } from '@/src/types/response.types';

export const login = async (email?: string, password?: string): Promise<RequestResponse<SignupResponse>> => {
  const res = await makeRequest<APIOperation.LOGIN, SignupResponse>({
    op: APIOperation.LOGIN,
    payload: { email, password },
  });
  return res;
};
