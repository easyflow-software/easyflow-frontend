'use client';
import { UserContext } from '@/src/providers/user-provider/UserProvider';
import { FunctionComponent, useContext } from 'react';

const Profile: FunctionComponent = () => {
  const { user } = useContext(UserContext);
  return <div>{user?.name}</div>;
};

export default Profile;
