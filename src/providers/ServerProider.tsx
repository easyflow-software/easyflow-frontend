'use server';
import { FunctionComponent, PropsWithChildren } from 'react';
import { UserType } from '../types/user.type';
import ClientProvider from './ClientProvider';
import { checkLogin, getUser, getProfilePicture } from '../services/api-services/server-operations/operations';

const ServerProvider: FunctionComponent<PropsWithChildren> = async ({ children }) => {
  let user: UserType | undefined;
  let profilePicture: string | undefined;

  const isLoggedIn = await checkLogin();
  if (isLoggedIn) {
    const userRes = await getUser();
    if (userRes.success) {
      user = userRes.data;
    }

    const profilePictureRes = await getProfilePicture();
    if (profilePictureRes.success) {
      profilePicture = profilePictureRes.data;
    }
  }

  return (
    <ClientProvider initialUser={user} initialProfilePicture={profilePicture}>
      {children}
    </ClientProvider>
  );
};

export default ServerProvider;
