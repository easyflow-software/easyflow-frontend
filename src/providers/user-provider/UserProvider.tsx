'use client';
import { UserType } from '@/src/types/user.type';
import { Dispatch, FunctionComponent, PropsWithChildren, SetStateAction, createContext } from 'react';
import { emitUnboundError } from '../provider-utils';

interface UserProviderType {
  user?: UserType;
  setUser: Dispatch<SetStateAction<UserType | undefined>>;
  profilePicture?: string;
  setProfilePicture: Dispatch<SetStateAction<string | undefined>>;
}
const UserContext = createContext<UserProviderType>({
  setUser: emitUnboundError,
  user: undefined,
  setProfilePicture: emitUnboundError,
  profilePicture: undefined,
});

const UserProvider: FunctionComponent<PropsWithChildren<UserProviderType>> = ({
  user,
  setUser,
  profilePicture,
  setProfilePicture,
  children,
}) => {
  return (
    <UserContext.Provider
      value={{
        setUser,
        user,
        profilePicture,
        setProfilePicture,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
export { UserContext };
