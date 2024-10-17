'use client';
import { useSession } from 'next-auth/react';
import { FunctionComponent } from 'react';

const Profile: FunctionComponent = () => {
  const { data: session } = useSession();
  return <div>{session?.user.name}</div>;
};

export default Profile;
