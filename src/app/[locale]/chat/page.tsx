'use ';
import { auth } from '@/src/auth';
import { redirect } from 'next/navigation';
import { FunctionComponent, ReactElement } from 'react';

const Chat: FunctionComponent = async (): Promise<ReactElement> => {
  const session = await auth();

  console.log('Refresh token on page: ', session?.user.refreshToken);
  if (!session) {
    redirect('/login');
  }

  return <div>Chat</div>;
};

export default Chat;
