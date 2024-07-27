import { SignupResponse, UserResponse } from '@/src/types/response.types';

enum APIOperation {
  SIGNUP = 'post:user/signup',
  LOGIN = 'post:auth/login',
  CHECK_IF_USER_EXISTS = 'get:user/exists/:email',
  GET_USER = 'get:user',
  GET_PROFILE_PICTURE = 'get:user/profile-picture',
}

type APIContext = {
  [APIOperation.SIGNUP]: RequestContext<
    APIOperation.SIGNUP,
    SignupResponse,
    { email?: string; name?: string; password?: string; publicKey?: string; privateKey?: string; iv?: string }
  >;
  [APIOperation.LOGIN]: RequestContext<APIOperation.LOGIN, void, { email?: string; password?: string }>;
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
