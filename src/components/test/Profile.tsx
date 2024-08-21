'use client';

import { UserContext } from '@/src/providers/user-provider/UserProvider';
import { ReactElement, useContext } from 'react';

const ProfileComponent = (): ReactElement => {
  const { user } = useContext(UserContext);
  if (!user) return <></>;
  return <div>{user.name}</div>;
};

export default ProfileComponent;
