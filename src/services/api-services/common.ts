import { SignupResponse, UserResponse } from '@/src/types/response.types';

enum APIOperation {
  REFRESH_TOKEN = 'post:auth/refresh',
  CHECK_LOGIN = 'get:auth/check',
  SIGNUP = 'post:user/signup',
  LOGIN = 'post:auth/login',
  LOGOUT = 'get:auth/logout',
  CHECK_IF_USER_EXISTS = 'get:user/exists/{email}',
  GET_USER = 'get:user',
  GET_PROFILE_PICTURE = 'get:user/profile-picture',
}

type APIContext = {
  [APIOperation.REFRESH_TOKEN]: RequestContext<
    APIOperation.REFRESH_TOKEN,
    { accessToken: string; refreshToken: string; accessTokenExpires: number },
    { refreshToken: string }
  >;
  [APIOperation.CHECK_LOGIN]: RequestContext<APIOperation.CHECK_LOGIN, true>;
  [APIOperation.SIGNUP]: RequestContext<
    APIOperation.SIGNUP,
    SignupResponse,
    { email: string; name: string; password: string; publicKey?: string; privateKey?: string; iv?: string }
  >;
  [APIOperation.LOGIN]: RequestContext<APIOperation.LOGIN, UserResponse, { email: string; password: string }>;
  [APIOperation.LOGOUT]: RequestContext<APIOperation.LOGOUT>;
  [APIOperation.CHECK_IF_USER_EXISTS]: RequestContext<
    APIOperation.CHECK_IF_USER_EXISTS,
    boolean,
    void,
    { email: string }
  >;
  [APIOperation.GET_USER]: RequestContext<APIOperation.GET_USER, UserResponse>;
  [APIOperation.GET_PROFILE_PICTURE]: RequestContext<APIOperation.GET_PROFILE_PICTURE, string>;
};

type WithPayload<TBase, TPayload> = TPayload extends void
  ? TBase
  : TBase & {
      payload: TPayload;
    };

type WithURLParams<TBase, TURLParams> = TURLParams extends void
  ? TBase
  : TBase & {
      params: TURLParams;
    };

type WithQueryParams<TBase, TQuery> = TQuery extends void
  ? TBase
  : TBase & {
      query: TQuery;
    };

type RequestContext<
  TEndpoint extends APIOperation,
  TResponse = void,
  TPayload = void,
  TURLParams = void,
  TQuery = void,
> = WithQueryParams<
  WithURLParams<
    WithPayload<
      {
        op: TEndpoint;
        responseType: TResponse;
        headers?: Record<string, string>;
      },
      TPayload
    >,
    TURLParams
  >,
  TQuery
>;

export { APIOperation };
export type { APIContext };
