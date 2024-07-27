'use client';
import { getProfilePicture, getUser } from '@/src/app/[locale]/actions';
import { UserType } from '@/src/types/user.type';
import { Dispatch, FunctionComponent, PropsWithChildren, SetStateAction, createContext, useEffect } from 'react';
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
  useEffect(() => {
    const fetchUser = async (): Promise<void> => {
      const res = await getUser();
      if (res.success) {
        setUser(res.data);
      }
    };
    void fetchUser();
    const fetchProfilePicture = async (): Promise<void> => {
      const res = await getProfilePicture();
      if (res.success) {
        setProfilePicture(res.data);
      }
    };
    void fetchProfilePicture();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
