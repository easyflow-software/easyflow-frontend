import NextAuth, { NextAuthConfig } from 'next-auth';
import type { Provider } from 'next-auth/providers';
import Credentials from 'next-auth/providers/credentials';
import { APIOperation } from './services/api-services/common';
import { UserType } from './types/user.type';
// eslint-disable-next-line
import { JWT } from 'next-auth/jwt';
import AppConfiguration from './config/app.config';
import { serverRequest } from './services/api-services/requests/server-side';
import { req } from './services/api-services/utils';
import { InvalidSignin } from './types/next-auth.types';

declare module 'next-auth' {
  interface Session {
    user: UserType;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends UserType {}
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: UserType;
  }
}

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: {},
      password: {},
      username: {},
    },
    authorize: async credentials => {
      const res = await serverRequest<APIOperation.LOGIN>({
        op: APIOperation.LOGIN,
        payload: {
          email: credentials.email as string,
          password: credentials.password as string,
        },
      });

      if (!res.success) {
        throw new InvalidSignin(res.errorCode);
      }

      return res.data;
    },
  }),
];

const callbacks: NextAuthConfig['callbacks'] = {
  async jwt({ token, user }) {
    if (user) {
      return {
        ...token,
        user: {
          ...token.user,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires,
        },
      };
    }

    const expires = new Date(token.user.accessTokenExpires * 1000);

    if (Date.now() < expires.getMilliseconds()) {
      return token;
    } else if (token.refreshToken !== null) {
      try {
        const res = await req<APIOperation.REFRESH_TOKEN>(AppConfiguration.get('NEXT_PUBLIC_REMOTE_URL'), {
          op: APIOperation.REFRESH_TOKEN,
          headers: {
            Authorization: token.user.refreshToken,
          },
        });

        return {
          ...token,
          user: {
            ...token.user,
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
            accessTokenExpires: res.data.accessTokenExpires,
          },
        };
      } catch (e) {
        // @ts-expect-error Error message for development purposes
        console.log('Some error happened while refreshing token.', e.response.data);
        return null;
      }
    } else {
      return null;
    }
  },
  async session({ session, token }) {
    if (token) {
      console.log('token: ', token);
      return {
        ...session,
        user: token.user,
      };
    }
    return session;
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  callbacks,
  pages: {
    signIn: '/login',
  },
});
