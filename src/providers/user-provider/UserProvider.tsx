'use client';
import { checkLogin, getProfilePicture, getUser } from '@/src/app/[locale]/actions';
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
      if (user) {
        return;
      }
      const isLoggedIn = await checkLogin();
      if (!isLoggedIn) {
        return;
      }
      const userRes = await getUser();
      if (userRes.success) {
        setUser(userRes.data);
      }
      if (profilePicture) {
        return;
      }
      const profilePictureRes = await getProfilePicture();
      if (profilePictureRes.success) {
        setProfilePicture(profilePictureRes.data);
      }
    };
    void fetchUser();
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
