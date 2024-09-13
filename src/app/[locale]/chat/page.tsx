'use sever';
import { checkLogin } from '@/src/services/api-services/server-operations/operations';
import { redirect } from 'next/navigation';
import { FunctionComponent, ReactElement } from 'react';

const Chat: FunctionComponent = async (): Promise<ReactElement> => {
  const isLoggedIn = await checkLogin();
  if (!isLoggedIn) {
    redirect('/login');
  }

  return <div>Chat</div>;
};

export default Chat;
