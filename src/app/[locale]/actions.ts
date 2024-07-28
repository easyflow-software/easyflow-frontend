'use server';
import { APIOperation } from '@/src/services/api-services/common';
import { makeRequest } from '@/src/services/api-services/request';
import { RequestResponse } from '@/src/types/request-response.type';
import { UserResponse } from '@/src/types/response.types';
import { cookies } from 'next/headers';

export const getUser = async (): Promise<RequestResponse<UserResponse>> => {
  const res = await makeRequest<APIOperation.GET_USER, UserResponse>({
    op: APIOperation.GET_USER,
  });
  return res;
};

export const getProfilePicture = async (): Promise<RequestResponse<string>> => {
  const res = await makeRequest<APIOperation.GET_PROFILE_PICTURE, string>({
    op: APIOperation.GET_PROFILE_PICTURE,
  });
  return res;
};

export const serverLogout = async (): Promise<void> => {
  cookies().delete('access_token');
  cookies().delete('refresh_token');
};
