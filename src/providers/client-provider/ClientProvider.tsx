'use client';
import { NextUIProvider } from '@nextui-org/react';
import { UserType } from '@src/types/user.type';
import { ThemeProvider } from 'next-themes';
import { useRouter } from 'next/navigation';
import { FunctionComponent, PropsWithChildren } from 'react';
import { UserProvider } from '../user-provider/UserProvider';

interface ClientProviderProps {
  initialUser?: UserType;
}

const ClientProvider: FunctionComponent<PropsWithChildren<ClientProviderProps>> = ({ children, initialUser }) => {
  // using the useRouter hook to get the router object for next ui link to navigate with the proper router and not just anchors
  // https://nextui.org/docs/guide/routing
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <UserProvider initialUser={initialUser}>{children}</UserProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
};

export default ClientProvider;
