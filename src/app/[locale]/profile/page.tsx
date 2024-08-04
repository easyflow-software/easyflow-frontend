'use server';
import { redirect } from 'next/navigation';
import { FunctionComponent, ReactElement } from 'react';
import { checkLogin } from '../actions';

const Profile: FunctionComponent = async (): Promise<ReactElement> => {
  const isLoggedIn = await checkLogin();
  if (!isLoggedIn) {
    redirect('/login');
  }
  return <div>Profile</div>;
};

export default Profile;
