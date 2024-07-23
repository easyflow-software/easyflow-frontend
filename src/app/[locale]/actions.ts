import { APIOperation } from '@/src/services/api-services/common';
import { makeRequest } from '@/src/services/api-services/request';
import { RequestResponse } from '@/src/types/request-response.type';
import { UserResponse } from '@/src/types/response.types';

export const getUser = async (): Promise<RequestResponse<UserResponse>> => {
  const res = await makeRequest<APIOperation.GET_USER, UserResponse>({
    op: APIOperation.GET_USER,
  });
  return res;
};
