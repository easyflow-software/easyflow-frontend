import { ToBeRemoved } from '@/src/types/response.types';

enum APIOperation {
  TO_BE_REMOVED = 'get:to-be-removed',
}

type APIContext = {
  [APIOperation.TO_BE_REMOVED]: RequestContext<
    APIOperation.TO_BE_REMOVED,
    ToBeRemoved,
    { email: string; name: string; password: string; publicKey: string; privateKey: string; iv: string }
  >;
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
