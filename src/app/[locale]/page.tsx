import TranslationsProvider from '@/src/components/translation-provider/TranslationsProvider';
import { Button } from '@nextui-org/react';
import { FunctionComponent } from 'react';
import initTranslations from '../i18n';

interface HomeProps {
  params: {
    locale: string;
  };
}

const i18nNamespaces = ['home'];

const Home: FunctionComponent<HomeProps> = async ({ params: { locale } }) => {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider resources={resources} locale={locale} namespaces={i18nNamespaces}>
      <Button color="primary">{t('home:button')}</Button>
    </TranslationsProvider>
  );
};

export default Home;
