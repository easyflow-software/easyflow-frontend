'use server';
import { APIOperation } from '@/src/services/api-services/common';
import { makeRequest } from '@/src/services/api-services/request';
import { RequestResponse } from '@/src/types/request-response.type';
import { UserResponse } from '@/src/types/response.types';

export const checkLogin = async (): Promise<boolean> => {
  const res = await makeRequest<APIOperation.CHECK_LOGIN>({
    op: APIOperation.CHECK_LOGIN,
  });
  if (!res.success) {
    return false;
  }
  return res.data;
};

export const getUser = async (): Promise<RequestResponse<UserResponse>> => {
  const res = await makeRequest<APIOperation.GET_USER>({
    op: APIOperation.GET_USER,
  });
  return res;
};

export const getProfilePicture = async (): Promise<RequestResponse<string>> => {
  const res = await makeRequest<APIOperation.GET_PROFILE_PICTURE>({
    op: APIOperation.GET_PROFILE_PICTURE,
  });
  return res;
};

export const serverLogout = async (): Promise<RequestResponse<void>> => {
  const res = await makeRequest<APIOperation.LOGOUT>({
    op: APIOperation.LOGOUT,
  });
  return res;
};
