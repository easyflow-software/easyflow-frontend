'use server';
import initTranslations from '@src/app/i18n';
import { ParamsType } from '@src/types/params.type';
import type { Metadata } from 'next';
import type { FunctionComponent, PropsWithChildren, ReactElement } from 'react';

const i18nNamespaces = ['metadata'];

export const generateMetadata = async ({ params }: ParamsType): Promise<Metadata> => {
  const { locale } = await params;
  const i18n = await initTranslations(locale, i18nNamespaces);
  return {
    title: i18n.t('metadata:chat.title'),
    description: i18n.t('metadata:chat.description'),
  };
};

const RootLayout: FunctionComponent<PropsWithChildren> = async ({ children }): Promise<ReactElement> => {
  return <main className="min-h-[calc(100vh-65px)] w-screen">{children}</main>;
};

export default RootLayout;
