'use server';
import initTranslations from '@src/app/i18n';
import TranslationsProvider from '@src/providers/translation-provider/TranslationsProvider';
import { FunctionComponent, PropsWithChildren, ReactElement } from 'react';

interface NavWrapperProps {
  params: {
    locale: string;
  };
}

const namspaces = ['navbar'];

const NavWrapper: FunctionComponent<PropsWithChildren<NavWrapperProps>> = async ({
  children,
  params: { locale },
}): Promise<ReactElement> => {
  const { resources } = await initTranslations(locale, namspaces);
  return (
    <TranslationsProvider resources={resources} locale={locale} namespaces={namspaces}>
      {children}
    </TranslationsProvider>
  );
};

export default NavWrapper;
