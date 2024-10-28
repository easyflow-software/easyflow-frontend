'use server';
import { SessionProvider } from 'next-auth/react';
import { FunctionComponent, PropsWithChildren } from 'react';
import { auth } from '../../auth';

const ServerProvider: FunctionComponent<PropsWithChildren> = async ({ children }) => {
  const session = await auth();

  return (
    <SessionProvider session={session} refetchOnWindowFocus>
      {children}
    </SessionProvider>
  );
};

export default ServerProvider;
