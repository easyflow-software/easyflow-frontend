'use server';

import { APIOperation } from '@/src/services/api-services/common';
import { makeRequest } from '@/src/services/api-services/request';
import { RequestResponse } from '@/src/types/request-response.type';
import { SignupResponse } from '@/src/types/response.types';

export const signup = async (
  email?: string,
  name?: string,
  password?: string,
  privateKey?: string,
  publicKey?: string,
  iv?: string,
): Promise<RequestResponse<SignupResponse>> => {
  const res = await makeRequest<APIOperation.SIGNUP, SignupResponse>({
    op: APIOperation.SIGNUP,
    payload: { email, password, name, privateKey, publicKey, iv },
  });
  return res;
};

export const checkIfUserExists = async (email: string): Promise<RequestResponse<boolean>> => {
  const res = await makeRequest<APIOperation.CHECK_IF_USER_EXISTS, boolean>({
    op: APIOperation.CHECK_IF_USER_EXISTS,
    params: { email },
  });
  return res;
};
