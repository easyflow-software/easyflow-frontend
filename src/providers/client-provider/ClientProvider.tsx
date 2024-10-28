'use client';
import { NextUIProvider } from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { useRouter } from 'next/navigation';
import { FunctionComponent, PropsWithChildren, useEffect, useRef } from 'react';

const ClientProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  // using the useRouter hook to get the router object for next ui link to navigate with the proper router and not just anchors
  // https://nextui.org/docs/guide/routing
  const router = useRouter();

  const { data: session, update } = useSession();

  const prevSession = useRef(session?.user);

  const callUpdate = async (): Promise<void> => {
    const newSession = await update();
    prevSession.current = newSession?.user;
  };

  useEffect(() => {
    void callUpdate();
  }, []);

  useEffect(() => {
    if (session?.user !== prevSession.current) {
      void callUpdate();
    }
  }, [session, prevSession]);

  return (
    <NextUIProvider navigate={router.push}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        {children}
      </ThemeProvider>
    </NextUIProvider>
  );
};

export default ClientProvider;
