'use server';
import TranslationsProvider from '@src/providers/translation-provider/TranslationsProvider';
import { FunctionComponent } from 'react';
import initTranslations from '../i18n';
import { Props } from './layout';

const i18nNamespaces = ['home'];

const Home: FunctionComponent<Props> = async props => {
  const { locale } = await props.params;

  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider resources={resources} namespaces={i18nNamespaces} locale={locale}>
      <div>Home</div>
    </TranslationsProvider>
  );
};

export default Home;
