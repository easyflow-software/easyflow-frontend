'use server';
import { Props } from '@/src/app/[locale]/layout';
import initTranslations from '@src/app/i18n';
import type { Metadata } from 'next';
import type { FunctionComponent, PropsWithChildren, ReactElement } from 'react';

const i18nNamespaces = ['metadata'];

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params;
  const i18n = await initTranslations(locale, i18nNamespaces);
  return {
    title: i18n.t('metadata:signup.title'),
  };
};

const RootLayout: FunctionComponent<PropsWithChildren> = async ({ children }): Promise<ReactElement> => {
  return <main className="min-h-[calc(100vh-65px)] w-screen">{children}</main>;
};

export default RootLayout;
