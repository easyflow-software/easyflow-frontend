import NextAuth, { NextAuthConfig } from 'next-auth';
import type { Provider } from 'next-auth/providers';
import Credentials from 'next-auth/providers/credentials';
import { APIOperation } from './services/api-services/common';
import { UserType } from './types/user.type';
import 'next-auth/jwt';
import AppConfiguration from './config/app.config';
import { req } from './services/api-services/utils';
import { InvalidSignin } from './types/next-auth.types';
import serverRequest from './services/api-services/requests/server-side';
import { JWT } from 'next-auth/jwt';

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

type TokenPayload = {
  accessToken: UserType['accessToken'];
  accessTokenExpires: UserType['accessTokenExpires'];
  refreshToken: UserType['refreshToken'];
};

// Cache for refresh promises to prevent multiple refreshes at the same time
const currentRefreshes = new Map<string, Promise<TokenPayload | null>>();

// Helper function to handle token refresh
const refreshAccessToken = async (token: JWT): Promise<TokenPayload | null> => {
  console.log('refresh: ', token.user.refreshToken);
  try {
    const res = await req<APIOperation.REFRESH_TOKEN>(AppConfiguration.get('NEXT_PUBLIC_REMOTE_URL'), {
      op: APIOperation.REFRESH_TOKEN,
      headers: {
        Origin: AppConfiguration.get('NEXT_PUBLIC_BASE_URL'),
        Authorization: `Bearer ${token.user.refreshToken}`,
      },
    });

    return {
      ...res.data,
    };
  } catch (error) {
    console.error('RefreshAccessTokenError:', error);
    return null;
  }
};

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
    // Initial sign in
    if (user) {
      return {
        ...token,
        user: user as UserType,
      };
    } else if (Date.now() < token.user.accessTokenExpires * 1000) {
      return token;
    } else if (token.user.refreshToken) {
      // If a refresh is already in progress, wait for it to complete
      let existingRefresh = currentRefreshes.get(token.user.id);
      // No refresh in progress start one
      if (!existingRefresh) {
        existingRefresh = refreshAccessToken(token);
        currentRefreshes.set(token.user.id, existingRefresh);
      }
      try {
        const result = await existingRefresh;
        currentRefreshes.delete(token.user.id); // Immediate cleanup

        if (result) {
          token.user.refreshToken = result.refreshToken;
          token.user.accessToken = result.accessToken;
          token.user.accessTokenExpires = result.accessTokenExpires;
          console.log('Returning new token', token);
          return token;
        }

        console.log('No refresh to return');
        return null;
      } catch {
        console.log('Failed to return refresh');
        currentRefreshes.delete(token.user.id);
        return null;
      }
    }

    return null;
  },

  async session({ session, token }) {
    return {
      ...session,
      user: token.user,
    };
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  callbacks,
  pages: {
    signIn: '/login',
  },
});
