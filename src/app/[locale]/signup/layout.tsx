'use server';
import initTranslations from '@src/app/i18n';
import type { Metadata } from 'next';
import type { FunctionComponent, PropsWithChildren, ReactElement } from 'react';
import { Props } from '../layout';

const i18nNamespaces = ['metadata'];

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params;
  const i18n = await initTranslations(locale, i18nNamespaces);
  return {
    title: i18n.t('metadata:signup.title'),
    description: i18n.t('metadata:signup.description'),
  };
};

const RootLayout: FunctionComponent<PropsWithChildren> = async ({ children }): Promise<ReactElement> => {
  return <main className="flex min-h-[calc(100vh-65px)] w-screen items-center justify-center">{children}</main>;
};

export default RootLayout;
