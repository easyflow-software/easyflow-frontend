'use server';
import { FunctionComponent, ReactElement } from 'react';
import Profile from '@/src/components/profile/Profile';

const ProfilePage: FunctionComponent = async (): Promise<ReactElement> => {
  return <Profile />;
};

export default ProfilePage;
