'use server';
import initTranslations from '@src/app/i18n';
import TranslationsProvider from '@src/providers/translation-provider/TranslationsProvider';
import { ParamsType } from '@src/types/params.type';
import { FunctionComponent, ReactElement } from 'react';
import Nav from './Nav';

const namspaces = ['navbar'];

const NavBar: FunctionComponent<ParamsType> = async ({ params }): Promise<ReactElement> => {
  const { locale } = await params;
  const { resources } = await initTranslations(locale, namspaces);
  return (
    <TranslationsProvider resources={resources} locale={locale} namespaces={namspaces}>
      <Nav locale={locale} />
    </TranslationsProvider>
  );
};

export default NavBar;
