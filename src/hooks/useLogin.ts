'use client';
import { makeClientSideRequest } from '../services/api-services/client.side';
import { APIOperation } from '../services/api-services/common';
import { LoginType } from '../types/login.type';
import { RequestResponse } from '../types/request-response.type';
import { UserResponse } from '../types/response.types';
import { UserType } from '../types/user.type';

const useLogin = (): {
  initialValues: LoginType;
  login: (email: string, password: string) => Promise<RequestResponse<UserResponse>>;
} => {
  const initialValues: LoginType = {
    email: '',
    password: '',
  };

  const login = async (email: string, password: string): Promise<RequestResponse<UserType>> => {
    const res = await makeClientSideRequest<APIOperation.LOGIN>({
      op: APIOperation.LOGIN,
      payload: { email, password },
    });
    return res;
  };

  return { initialValues, login };
};

export default useLogin;
