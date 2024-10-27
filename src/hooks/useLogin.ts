'use client';
import { APIOperation } from '../services/api-services/common';
import { clientRequest } from '../services/api-services/requests/client-side';
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
    const res = await clientRequest<APIOperation.LOGIN>({
      op: APIOperation.LOGIN,
      payload: { email, password },
    });
    return res;
  };

  return { initialValues, login };
};

export default useLogin;
