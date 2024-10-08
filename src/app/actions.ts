'use server';

import { signIn } from '../auth';
import { RequestResponse } from '../types/request-response.type';

export const login = async (values: { email: string; password: string }): Promise<RequestResponse<string>> => {
  try {
    const url = await signIn('credentials', { redirect: false, ...values });
    return {
      success: true,
      data: url,
    };
  } catch (e) {
    return {
      success: false,
      // @ts-expect-error errors are weird
      errorCode: e.code,
    };
  }
};
