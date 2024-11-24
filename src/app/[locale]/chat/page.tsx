'use server';
import { Chat as ChatComponent } from '@src/components/chat/Chat';
import { checkLogin } from '@src/utils/check-login';
import { FunctionComponent, ReactElement } from 'react';

const Chat: FunctionComponent = async (): Promise<ReactElement> => {
  await checkLogin('/chat');
  return <ChatComponent />;
};

export default Chat;
