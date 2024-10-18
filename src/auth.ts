import NextAuth, { NextAuthConfig } from 'next-auth';
import type { Provider } from 'next-auth/providers';
import Credentials from 'next-auth/providers/credentials';
import { APIOperation } from './services/api-services/common';
import { UserType } from './types/user.type';
import 'next-auth/jwt';
import AppConfiguration from './config/app.config';
import { serverRequest } from './services/api-services/requests/server-side';
import { req } from './services/api-services/utils';
import { InvalidSignin } from './types/next-auth.types';

declare module 'next-auth' {
  interface Session {
    user: UserType;
  }
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
        user: user as UserType,
      };
    }

    if (Date.now() < token.user.accessTokenExpires * 1000) {
      return token;
    } else if (token.user.refreshToken) {
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
      } catch {
        return null;
      }
    } else {
      return null;
    }
  },

  async session({ session, token }) {
    console.log('session token', token);
    if (token) {
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
