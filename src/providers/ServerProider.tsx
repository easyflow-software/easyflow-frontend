'use server';
import { FunctionComponent, PropsWithChildren } from 'react';
import { UserType } from '../types/user.type';
import ClientProvider from './ClientProvider';
import { serverRequest } from '../services/api-services/requests/server-side';
import { APIOperation } from '../services/api-services/common';

const ServerProvider: FunctionComponent<PropsWithChildren> = async ({ children }) => {
  let user: UserType | undefined;
  let profilePicture: string | undefined;

  const userRes = await serverRequest<APIOperation.GET_USER>({ op: APIOperation.GET_USER });
  if (userRes.success) {
    user = userRes.data;
  }

  const profilePictureRes = await serverRequest<APIOperation.GET_PROFILE_PICTURE>({
    op: APIOperation.GET_PROFILE_PICTURE,
  });
  if (profilePictureRes.success) {
    profilePicture = profilePictureRes.data;
  }

  return (
    <ClientProvider initialUser={user} initialProfilePicture={profilePicture}>
      {children}
    </ClientProvider>
  );
};

export default ServerProvider;
