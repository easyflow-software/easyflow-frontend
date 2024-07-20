import { serverSideRequest } from '@/src/services/api-services/server-side';
import { AxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const data = await req.json();
    const response = await serverSideRequest(data);
    const res = NextResponse.json(response.data, {
      status: response.status,
      statusText: response.statusText,
      // eslint-disable-next-line
      headers: Object.keys(response.headers).map(key => [key, response.headers[key].toString()]),
    });
    return res;
  } catch (err) {
    if (!(err instanceof AxiosError)) throw err;
    const msg = {
      request: {
        url: err.config?.url,
      },
      status: err.response?.status,
      statusText: err.response?.statusText,
      body: JSON.stringify(err.response?.data),
    };

    console.error(msg);

    const statusCode = err.response?.status ?? 500;
    const statusText = err.response?.statusText ?? 'Internal Server Error';

    const res = NextResponse.json(err.response?.data ?? { statusCode, message: 'Internal Server Error' }, {
      status: statusCode,
      statusText: statusText,
    });

    return res;
  }
};
