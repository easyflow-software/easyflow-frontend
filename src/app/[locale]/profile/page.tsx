'use server';
import Profile from '@/src/components/profile/Profile';
import { FunctionComponent, ReactElement } from 'react';

const ProfilePage: FunctionComponent = async (): Promise<ReactElement> => {
  return <Profile />;
};

export default ProfilePage;
