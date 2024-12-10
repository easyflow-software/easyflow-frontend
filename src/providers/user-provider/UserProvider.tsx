'use client';
import { APIOperation } from '@src/services/api-services/common';
import { clientRequest } from '@src/services/api-services/requests/client-side';
import { User } from '@src/types/user.type';
import {
  base64ToUint8,
  generateWrapingKey,
  hash,
  retrivePrivateKey,
  retrivePublicKey,
  retriveWrapingKey,
} from '@src/utils/encryption-utils';
import { useRouter } from 'next/navigation';
import {
  createContext,
  Dispatch,
  FunctionComponent,
  PropsWithChildren,
  ReactElement,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
// import { Chat } from '../../types/chat.type';
import { emitUnboundError } from '../provider-utils';

// @ts-expect-error This is needed and reduces hastle
interface UserWithKeys extends User {
  privateKey: CryptoKey;
  publicKey: CryptoKey;
}

// interface ChatWithKey extends Chat {
//   key: CryptoKey;
// }

interface UserContextProps {
  user?: UserWithKeys;
  setUser: Dispatch<SetStateAction<UserWithKeys | undefined>>;
  isLoading: boolean;
  refetchUser: () => Promise<void>;
}

interface UserProviderProps {
  initialUser?: User;
}

const data: UserContextProps = {
  user: undefined,
  setUser: emitUnboundError,
  isLoading: true,
  refetchUser: emitUnboundError,
};

async function getUserWithKeys(user: User): Promise<UserWithKeys | undefined> {
  const ivBuffer = base64ToUint8(user.iv);
  const keyString = window.localStorage.getItem('wraping_key');

  if (keyString) {
    try {
      const randomHash = await hash(user.wrapingKeyRandom, ivBuffer);

      const unwrapingKey = await generateWrapingKey(randomHash);

      const key = await retriveWrapingKey(keyString, unwrapingKey, ivBuffer);

      const privateKey = await retrivePrivateKey(user.privateKey, key, ivBuffer);

      const publicKey = await retrivePublicKey(user.publicKey);

      const userWithKeys: UserWithKeys = {
        ...user,
        privateKey,
        publicKey,
      };

      return userWithKeys;
    } catch {
      return undefined;
    }
  } else {
    return undefined;
  }
}

// async function getChatWithKey(chat: Chat): Promise<ChatWithKey> {

// }

const UserContext = createContext<UserContextProps>(data);

const UserProvider: FunctionComponent<PropsWithChildren<UserProviderProps>> = ({
  children,
  initialUser,
}): ReactElement => {
  const [user, setUser] = useState<UserWithKeys | undefined>();
  // const [chats, setChats] = useState<ChatWithKey[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const timer = useRef<Timer>(undefined);
  const router = useRouter();

  async function setUserWithKeys(user: User): Promise<void> {
    const userWithKeys = await getUserWithKeys(user);
    if (!user) {
      router.push('/login');
    } else {
      setUser(userWithKeys);
    }
  }

  async function refetchUser(): Promise<void> {
    const res = await clientRequest<APIOperation.GET_USER>({ op: APIOperation.GET_USER });
    if (res.success) {
      await setUserWithKeys(res.data);
    }
  }

  useEffect(() => {
    if (initialUser) {
      void setUserWithKeys(initialUser);
    } else {
      setIsLoading(false);
    }
  }, [initialUser]);

  // This is needed to prevent flashing of the login and signup buttons when the user reloads the page and is already logged in
  useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user]);

  // automatic refreshes on the client side before the token expires
  useEffect(() => {
    async function refreshToken(): Promise<void> {
      const res = await clientRequest<APIOperation.REFRESH_TOKEN>({ op: APIOperation.REFRESH_TOKEN });

      timer.current = setTimeout(refreshToken, res.success ? (res.data.accessTokenExpiresIn - 60) * 1000 : 60 * 1000);
    }

    void refreshToken();
    return () => clearTimeout(timer.current);
  }, []);

  // load the users chats when he is logged in
  // useEffect(async () => {
  //   if (user) {
  //     async function getChats() {
  //       const res = await clientRequest<APIOperation.GET_CHATS>({ op: APIOperation.GET_CHATS });
  //       if (res.success) res.data.forEach((chat: Chat) => {

  //       });
  //     }
  //   }
  // }, [user]);

  // conect to the websocket when user is set
  useEffect(() => {
    if (user) {
      const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL ?? '');
      ws.addEventListener('open', () => console.log('Websocket connection established'));
      ws.onmessage = (event: MessageEvent) => {
        console.log(event.data);
      };
      return () => ws.close();
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        refetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
