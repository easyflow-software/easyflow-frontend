'use client';
import { APIOperation } from '@src/services/api-services/common';
import { clientRequest } from '@src/services/api-services/requests/client-side';
import { UserType } from '@src/types/user.type';
import { base64ToArrayBuffer, base64ToUint8, generateWrappingKey, hash } from '@src/utils/encryption-utils';
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
import { emitUnboundError } from '../provider-utils';

// @ts-expect-error This is needed and reduces hastle
interface UserWithKeys extends UserType {
  privateKey: CryptoKey;
  publicKey: CryptoKey;
}

interface UserContextProps {
  user?: UserWithKeys;
  setUser: Dispatch<SetStateAction<UserWithKeys | undefined>>;
  refetchUser: () => Promise<void>;
}

interface UserProviderProps {
  initialUser?: UserType;
}

const data: UserContextProps = {
  user: undefined,
  setUser: emitUnboundError,
  refetchUser: emitUnboundError,
};

async function getUserWithKeys(user: UserType): Promise<UserWithKeys | undefined> {
  const ivBuffer = base64ToUint8(user.iv);
  const keyString = window.localStorage.getItem('wrapping_key');

  if (keyString) {
    try {
      const randomHash = await hash(user.wrappingKeyRandom, ivBuffer);

      const unwrappingKey = await generateWrappingKey(randomHash);

      const key = await window.crypto.subtle.unwrapKey(
        'raw',
        base64ToArrayBuffer(keyString),
        unwrappingKey,
        { name: 'AES-GCM', iv: ivBuffer },
        { name: 'AES-GCM', length: 256 },
        false,
        ['wrapKey', 'unwrapKey'],
      );

      const privateKey = await window.crypto.subtle.unwrapKey(
        'pkcs8',
        base64ToArrayBuffer(user.privateKey),
        key,
        { name: 'AES-GCM', iv: ivBuffer },
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        false,
        ['decrypt'],
      );

      const publicKey = await window.crypto.subtle.importKey(
        'spki',
        base64ToArrayBuffer(user.publicKey),
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        false,
        ['encrypt'],
      );

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

const UserContext = createContext<UserContextProps>(data);

const UserProvider: FunctionComponent<PropsWithChildren<UserProviderProps>> = ({
  children,
  initialUser,
}): ReactElement => {
  const [user, setUser] = useState<UserWithKeys | undefined>();
  const timer = useRef<Timer>();
  const router = useRouter();

  async function setUserWithKeys(user: UserType): Promise<void> {
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
    }
  }, [initialUser]);

  // automatic refreshes on the client side before the token expires
  useEffect(() => {
    const refreshToken = async (): Promise<void> => {
      const res = await clientRequest<APIOperation.REFRESH_TOKEN>({ op: APIOperation.REFRESH_TOKEN });

      timer.current = setTimeout(refreshToken, res.success ? (res.data.accessTokenExpiresIn - 60) * 1000 : 60 * 1000);
    };

    void refreshToken();

    return () => clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    void refetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        refetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
