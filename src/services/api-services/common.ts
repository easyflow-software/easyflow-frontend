import { SignupResponse } from '@/src/types/response.types';

enum APIOperation {
  SIGNUP = 'post:user/signup',
  LOGIN = 'post:auth/login',
}

type APIContext = {
  [APIOperation.SIGNUP]: RequestContext<
    APIOperation.SIGNUP,
    SignupResponse,
    { email: string; name: string; password: string; publicKey: string; privateKey: string }
  >;
  [APIOperation.LOGIN]: RequestContext<APIOperation.LOGIN, void, { email?: string; password?: string }>;
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
