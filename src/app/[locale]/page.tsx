'use server';
import TranslationsProvider from '@/src/providers/translation-provider/TranslationsProvider';
import { FunctionComponent } from 'react';
import initTranslations from '../i18n';

export interface HomeProps {
  params: Promise<{
    locale: string;
  }>;
}

const i18nNamespaces = ['home'];

const Home: FunctionComponent<HomeProps> = async props => {
  const { locale } = await props.params;

  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider resources={resources} namespaces={i18nNamespaces} locale={locale}>
      <div>Home</div>
    </TranslationsProvider>
  );
};

export default Home;
