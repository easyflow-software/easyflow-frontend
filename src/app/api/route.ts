import { serverSideRequest } from '@/src/services/api-services/server-side';
import { AxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequest, NextApiResponse>();

const routerHandler = router.handler({
  onError: (err, _: NextApiRequest, res: NextApiResponse) => {
    console.error(err);
    res.status(500).send({ statusCode: 500, message: 'Internal Server Error' });
  },
  onNoMatch: (_: NextApiRequest, res: NextApiResponse) => {
    res.status(405).send({ statusCode: 405, message: 'Method not allowed' });
  },
});

router.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await serverSideRequest(req, req.body);
    res.setHeader('Set-Cookie', response.headers['set-cookie'] ? response.headers['set-cookie'] : []);
    res.status(200).send(response.data);
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

    res.status(statusCode).send(err.response?.data ?? { statusCode, message: 'Internal Server Error' });
  }
});

export default routerHandler;
