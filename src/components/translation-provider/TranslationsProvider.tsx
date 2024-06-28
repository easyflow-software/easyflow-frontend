'use client';

import initTranslations from '@/src/app/i18n';
import { Resource, createInstance } from 'i18next';
import { FunctionComponent } from 'react';
import { I18nextProvider } from 'react-i18next';

interface TranslationsProviderProps {
  children: React.ReactNode;
  locale: string;
  namespaces: string[];
  resources?: Resource;
}

const TranslationsProvider: FunctionComponent<TranslationsProviderProps> = ({
  children,
  locale,
  namespaces,
  resources,
}): JSX.Element => {
  const i18n = createInstance();
  void initTranslations(locale, namespaces, i18n, resources);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default TranslationsProvider;
