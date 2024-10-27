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
    }

    // Return previous token if the access token has not expired
    if (Date.now() < token.user.accessTokenExpires * 1000) {
      return token;
    }

    // Access token has expired, try to refresh it
    if (token.user.refreshToken) {
      // If a refresh is already in progress, wait for it to complete
      const existingRefresh = currentRefreshes.get(token.user.id);
      if (existingRefresh) {
        try {
          const result = await existingRefresh;
          currentRefreshes.delete(token.user.id); // Immediate cleanup

          if (result) {
            return {
              ...token,
              user: {
                ...token.user,
                accessToken: result.accessToken,
                accessTokenExpires: result.accessTokenExpires,
                refreshToken: result.refreshToken,
              },
            };
          }
          return null;
        } catch {
          currentRefreshes.delete(token.user.id);
          return null;
        }
      }

      // Start new refresh
      const refreshPromise = refreshAccessToken(token);
      currentRefreshes.set(token.user.id, refreshPromise);

      try {
        const result = await refreshPromise;
        currentRefreshes.delete(token.user.id);

        if (!result) {
          return null;
        }

        // Create new token object with all updated fields
        return {
          ...token,
          user: {
            ...token.user,
            accessToken: result.accessToken,
            accessTokenExpires: result.accessTokenExpires,
            refreshToken: result.refreshToken, // Ensure refresh token is updated
          },
        };
      } catch {
        currentRefreshes.delete(token.user.id);
        return null;
      }
    }

    return null;
  },

  async session({ session, token }) {
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
