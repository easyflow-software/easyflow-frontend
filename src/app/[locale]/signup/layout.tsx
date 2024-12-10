'use server';
import initTranslations from '@src/app/i18n';
import NavBar from '@src/components/nav/NavBar';
import { Params } from '@src/types/params.type';
import type { Metadata } from 'next';
import type { FunctionComponent, PropsWithChildren, ReactElement } from 'react';

const i18nNamespaces = ['metadata'];

export const generateMetadata = async ({ params }: Params): Promise<Metadata> => {
  const { locale } = await params;
  const i18n = await initTranslations(locale, i18nNamespaces);
  return {
    title: i18n.t('metadata:signup.title'),
    description: i18n.t('metadata:signup.description'),
  };
};

const RootLayout: FunctionComponent<PropsWithChildren<Params>> = async ({
  params,
  children,
}): Promise<ReactElement> => {
  return (
    <>
      <NavBar params={params} />
      <main className="flex min-h-[calc(100vh-65px)] w-screen items-center justify-center">{children}</main>
    </>
  );
};

export default RootLayout;
