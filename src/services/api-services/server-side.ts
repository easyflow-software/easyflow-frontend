import axios, { AxiosResponse } from 'axios';
import AppConfiguration from '../../config/app.config';
import { APIContext, APIOperation } from './common';

const stringifyQueryValues = (endpoint: string, query: Record<string, string | string[]>): string => {
  const urlSearchParams = new URLSearchParams();
  if (Object.entries(query ?? length === 0)) return endpoint;

  for (const [k, v] of Object.entries(query ?? {})) {
    if (Array.isArray(v)) {
      for (const t of v) urlSearchParams.append(k, t);
    } else if (v !== null) {
      urlSearchParams.append(k, v);
    }
  }

  return `${endpoint}?${urlSearchParams.toString()}`;
};

const replaceURLParams = (endpoint: string, params: Record<string, string | number> | undefined): string => {
  if (!params) return endpoint;
  let res = endpoint;
  for (const k of Object.keys(params)) {
    res = res.replace(`{${k}}`, params[k].toString());
  }
  return res;
};

const req = async <T extends APIOperation, R = APIContext[T]['responseType']>(
  endpointPrefix: string,
  options: Omit<APIContext[T], 'responseType'>,
): Promise<AxiosResponse<R>> => {
  if (!Object.values(APIOperation).includes(options.op)) throw new Error(`Invalid operation: ${options.op}`);

  const endpoint =
    endpointPrefix +
    stringifyQueryValues(
      replaceURLParams(
        options.op.replace(/^[^:]+:/, ''),
        (options as unknown as { params: Record<string, string | number> }).params,
      ),
      {
        ...(options as unknown as { query: Record<string, string[]> }).query,
      },
    );
  const httpMethod = options.op.split(':', 1)[0] as 'get' | 'post' | 'put' | 'patch' | 'delete';

  const headers = options.headers;

  switch (httpMethod) {
    case 'get': {
      return axios.get<R>(endpoint, {
        headers: {
          ...headers,
        },
        withCredentials: true,
      });
    }
    case 'post': {
      return axios.post<R>(endpoint, (options as unknown as { payload: unknown }).payload, {
        headers: {
          ...headers,
        },
        withCredentials: true,
      });
    }
    case 'put': {
      return axios.put<R>(endpoint, (options as unknown as { payload: unknown }).payload, {
        headers: {
          ...headers,
        },
        withCredentials: true,
      });
    }
    case 'patch': {
      return axios.patch<R>(endpoint, (options as unknown as { payload: unknown }).payload, {
        headers: {
          ...headers,
        },
        withCredentials: true,
      });
    }
    case 'delete': {
      return axios.delete<R>(endpoint, {
        headers: {
          ...headers,
        },
        withCredentials: true,
      });
    }
    default: {
      throw new Error(`Cannot perform operation: ${httpMethod}`);
    }
  }
};

const serverSideRequest = async <T extends APIOperation, R = APIContext[T]['responseType']>(
  options: Omit<APIContext[T], 'responseType'>,
): Promise<AxiosResponse<R>> => {
  const res = await rawServerSideRequest(options);
  return res as AxiosResponse<R>;
};

const rawServerSideRequest = async <T extends APIOperation, R extends APIContext[T]['responseType']>(
  options: Omit<APIContext[T], 'responseType'>,
): Promise<AxiosResponse<R>> => {
  if (typeof window !== 'undefined') throw new Error('Request can only be performed Serverside');

  return req(AppConfiguration.get('REMOTE_URL'), options);
};

export { serverSideRequest };
