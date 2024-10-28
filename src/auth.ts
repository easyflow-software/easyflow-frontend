import NextAuth, { NextAuthConfig } from 'next-auth';
import 'next-auth/jwt';
import { JWT } from 'next-auth/jwt';
import type { Provider } from 'next-auth/providers';
import Credentials from 'next-auth/providers/credentials';
import AppConfiguration from './config/app.config';
import { APIOperation } from './services/api-services/common';
import serverRequest from './services/api-services/requests/server-side';
import { req } from './services/api-services/utils';
import { InvalidSignin } from './types/next-auth.types';
import { UserType } from './types/user.type';

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
  } catch {
    return null;
  }
};

const hash = async (token: string): Promise<string> => {
  return Buffer.from(await crypto.subtle.digest('SHA-1', Buffer.from(token))).toString('base64');
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
    } else if (Date.now() < (token.user.accessTokenExpires - AppConfiguration.get('ACCESS_TOKEN_BUFFER_TIME')) * 1000) {
      return token;
    } else if (token.user.refreshToken) {
      // If a refresh is already in progress, wait for it to complete
      let existingRefresh = currentRefreshes.get(await hash(token.user.refreshToken));
      // No refresh in progress start one
      if (!existingRefresh) {
        existingRefresh = refreshAccessToken(token);
        currentRefreshes.set(await hash(token.user.refreshToken), existingRefresh);
      }
      try {
        const result = await existingRefresh;
        currentRefreshes.delete(await hash(token.user.refreshToken)); // Immediate cleanup

        if (result) {
          token.user.refreshToken = result.refreshToken;
          token.user.accessToken = result.accessToken;
          token.user.accessTokenExpires = result.accessTokenExpires;
          return token;
        }

        return null;
      } catch {
        currentRefreshes.delete(await hash(token.user.refreshToken));
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
