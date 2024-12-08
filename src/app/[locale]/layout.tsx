'use server';
import initTranslations from '@src/app/i18n';
import ClientProvider from '@src/providers/client-provider/ClientProvider';
import { APIOperation } from '@src/services/api-services/common';
import serverRequest from '@src/services/api-services/requests/server-side';
import { ParamsType } from '@src/types/params.type';
import { UserType } from '@src/types/user.type';
import cx from 'classnames';
import { dir } from 'i18next';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { FunctionComponent, PropsWithChildren, ReactElement } from 'react';
import '../globals.css';
import '../i18n';

const inter = Inter({ subsets: ['latin'] });

const i18nNamespaces = ['metadata'];

export interface Props {
  params: Promise<{
    locale: string;
  }>;
}

export const generateMetadata = async ({ params }: ParamsType): Promise<Metadata> => {
  const { locale } = await params;
  const i18n = await initTranslations(locale, i18nNamespaces);
  return {
    title: i18n.t('metadata:home.title'),
    description: i18n.t('metadata:home.description'),
  };
};

const RootLayout: FunctionComponent<PropsWithChildren<ParamsType>> = async ({
  params,
  children,
}): Promise<ReactElement> => {
  const { locale } = await params;

  let initialUser: UserType | undefined;
  const res = await serverRequest<APIOperation.GET_USER>({ op: APIOperation.GET_USER });
  if (res.success) {
    initialUser = res.data;
  }

  return (
    <html lang={locale} dir={dir(locale)} className="h-full w-full">
      <body className={cx('h-full w-full bg-background', inter.className)}>
        <ClientProvider initialUser={initialUser}>
          <main className="min-h-[calc(100vh-65px)] w-screen">{children}</main>
        </ClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
