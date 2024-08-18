'use client';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider } from 'next-themes';
import { useRouter } from 'next/navigation';
import { FunctionComponent, PropsWithChildren, useState } from 'react';
import { UserType } from '../types/user.type';
import UserProvider from './user-provider/UserProvider';

interface ClientProviderProps {
  initialUser?: UserType;
  initialProfilePicture?: string;
}

const ClientProvider: FunctionComponent<PropsWithChildren<ClientProviderProps>> = ({
  children,
  initialUser,
  initialProfilePicture,
}) => {
  // using the useRouter hook to get the router object for next ui link to navigate with the proper router and not just anchors
  // https://nextui.org/docs/guide/routing
  const router = useRouter();

  const [user, setUser] = useState<UserType | undefined>(initialUser);
  const [profilePicture, setProfilePicture] = useState<string | undefined>(initialProfilePicture);

  return (
    <NextUIProvider navigate={router.push}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <UserProvider
          setUser={setUser}
          user={user}
          setProfilePicture={setProfilePicture}
          profilePicture={profilePicture}
        >
          {children}
        </UserProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
};

export default ClientProvider;
