import NextAuth, { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { Provider } from 'next-auth/providers';
import { APIOperation } from './services/api-services/common';
import { UserType } from './types/user.type';
// eslint-disable-next-line
import { JWT } from 'next-auth/jwt';
import { serverRequest } from './services/api-services/requests/server-side';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
  }

  // eslint-disable-next-line
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
        accessTokenExpires: Date.now() + 60 * 10 * 1000, // 10 minutes (in milliseconds)
      };
    }

    if (Date.now() < token.accessTokenExpires - 30 * 1000) {
      return token;
    } else {
      const res = await serverRequest<APIOperation.REFRESH_TOKEN>({
        op: APIOperation.REFRESH_TOKEN,
        payload: {
          refreshToken: token.refreshToken,
        },
      });

      if (!res.success) {
        return null;
      }

      return {
        ...token,
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
        accessTokenExpires: Date.now() + 60 * 10, // 10 minutes
      };
    }
  },
  async session({ session, token }) {
    if (token) {
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
