'use client';
import { APIOperation } from '@src/services/api-services/common';
import { clientRequest } from '@src/services/api-services/requests/client-side';
import { UserType } from '@src/types/user.type';
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

interface UserContextProps {
  user?: UserType;
  setUser: Dispatch<SetStateAction<UserType | undefined>>;
  refetchUser: () => Promise<void>;
}

const data: UserContextProps = {
  user: undefined,
  setUser: emitUnboundError,
  refetchUser: emitUnboundError,
};

const UserContext = createContext<UserContextProps>(data);

const UserProvider: FunctionComponent<PropsWithChildren> = ({ children }): ReactElement => {
  const [user, setUser] = useState<UserType | undefined>();
  const timer = useRef<Timer>();

  const refetchUser = async (): Promise<void> => {
    const res = await clientRequest<APIOperation.GET_USER>({ op: APIOperation.GET_USER });
    if (res.success) {
      setUser(res.data);
    }
  };

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
