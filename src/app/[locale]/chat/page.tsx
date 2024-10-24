'use sever';
import { auth } from '@/src/auth';
import { redirect } from 'next/navigation';
import { FunctionComponent, ReactElement } from 'react';

const Chat: FunctionComponent = async (): Promise<ReactElement> => {
  console.log('Chat');
  const session = await auth();
  console.log('Chat auth done');
  if (!session) {
    redirect('/login');
  }

  return <div>Chat</div>;
};

export default Chat;
