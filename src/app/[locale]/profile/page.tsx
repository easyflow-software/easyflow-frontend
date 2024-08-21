'use server';
import { redirect } from 'next/navigation';
import { FunctionComponent, ReactElement } from 'react';
import { checkLogin } from '../actions';
import ProfileComponent from '@/src/components/test/Profile';

const Profile: FunctionComponent = async (): Promise<ReactElement> => {
  const isLoggedIn = await checkLogin();
  if (!isLoggedIn) {
    redirect('/login');
  }
  return <ProfileComponent />;
};

export default Profile;
