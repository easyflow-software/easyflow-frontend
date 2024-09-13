'use server';
import { redirect } from 'next/navigation';
import { FunctionComponent, ReactElement } from 'react';
import { checkLogin } from '@/src/services/api-services/server-operations/operations';
import Profile from '@/src/components/profile/Profile';

const ProfilePage: FunctionComponent = async (): Promise<ReactElement> => {
  const isLoggedIn = await checkLogin();
  if (!isLoggedIn) {
    redirect('/login');
  }
  return <Profile />;
};

export default ProfilePage;
