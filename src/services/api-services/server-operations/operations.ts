'use server';
import { APIOperation } from '@/src/services/api-services/common';
import { makeServerSideRequest } from '@/src/services/api-services/server-side';
import { RequestResponse } from '@/src/types/request-response.type';
import { UserResponse } from '@/src/types/response.types';

export const checkLogin = async (): Promise<boolean> => {
  const res = await makeServerSideRequest<APIOperation.CHECK_LOGIN>({
    op: APIOperation.CHECK_LOGIN,
  });
  return res.success;
};

export const getUser = async (): Promise<RequestResponse<UserResponse>> => {
  const res = await makeServerSideRequest<APIOperation.GET_USER>({
    op: APIOperation.GET_USER,
  });
  return res;
};

export const getProfilePicture = async (): Promise<RequestResponse<string>> => {
  const res = await makeServerSideRequest<APIOperation.GET_PROFILE_PICTURE>({
    op: APIOperation.GET_PROFILE_PICTURE,
  });
  return res;
};
