'use client';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider } from 'next-themes';
import { useRouter } from 'next/navigation';
import { FunctionComponent, PropsWithChildren } from 'react';

const ClientProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  // using the useRouter hook to get the router object for next ui link to navigate with the proper router and not just anchors
  // https://nextui.org/docs/guide/routing
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        {children}
      </ThemeProvider>
    </NextUIProvider>
  );
};

export default ClientProvider;
