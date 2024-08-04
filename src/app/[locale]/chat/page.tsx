'use sever';
import { redirect } from 'next/navigation';
import { FunctionComponent, ReactElement } from 'react';
import { checkLogin } from '../actions';

const Chat: FunctionComponent = async (): Promise<ReactElement> => {
  const isLoggedIn = await checkLogin();
  if (!isLoggedIn) {
    redirect('/login');
  }

  return <div>Chat</div>;
};

export default Chat;
