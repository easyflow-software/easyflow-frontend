'use server';
import { Props } from '@/src/app/[locale]/layout';
import initTranslations from '@src/app/i18n';
import NavBar from '@src/components/nav/NavBar';
import type { Metadata } from 'next';
import type { FunctionComponent, PropsWithChildren, ReactElement } from 'react';

const i18nNamespaces = ['metadata'];

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params;
  const i18n = await initTranslations(locale, i18nNamespaces);
  return {
    title: i18n.t('metadata:profile.title'),
    description: i18n.t('metadata:profile.description'),
  };
};

const RootLayout: FunctionComponent<PropsWithChildren<Props>> = async ({ params, children }): Promise<ReactElement> => {
  const { locale } = await params;

  return (
    <>
      <NavBar params={{ locale }} />
      <main className="min-h-[calc(100vh-65px)] w-screen">{children}</main>
    </>
  );
};

export default RootLayout;
