import NextAuth, { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { Provider } from 'next-auth/providers';
import { APIOperation } from './services/api-services/common';
import { UserType } from './types/user.type';
// eslint-disable-next-line
import { JWT } from 'next-auth/jwt';
import { serverRequest } from './services/api-services/requests/server-side';
import { req } from './services/api-services/utils';
import AppConfiguration from './config/app.config';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends UserType {}
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
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
        return null;
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
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
        accessTokenExpires: user.accessTokenExpires,
      };
    }

    const expires = new Date(token.accessTokenExpires * 1000);

    if (Date.now() < expires.getMilliseconds()) {
      return token;
    } else {
      try {
        const res = await req<APIOperation.REFRESH_TOKEN>(AppConfiguration.get('NEXT_PUBLIC_REMOTE_URL'), {
          op: APIOperation.REFRESH_TOKEN,
          headers: {
            Authorization: token.refreshToken,
          },
        });

        return {
          ...token,
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
          accessTokenExpires: res.data.accessTokenExpires,
        };
      } catch (e) {
        // @ts-expect-error Error message for development purposes
        console.log('Some error happened while refreshing token.', e.response.data);
        return null;
      }
    }
  },
  async session({ session, token }) {
    if (token) {
      console.log('token: ', token);
      return {
        ...session,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        accessTokenExpires: token.accessTokenExpires,
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
