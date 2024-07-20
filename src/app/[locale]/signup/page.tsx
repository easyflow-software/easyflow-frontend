import SignupForm from '@/src/components/signup-form/SignupForm';
import TranslationsProvider from '@/src/components/translation-provider/TranslationsProvider';
import initTranslations from '@i18n';
import { FunctionComponent } from 'react';

interface HomeProps {
  params: {
    locale: string;
  };
}

const i18nNamespaces = ['signup'];

const Home: FunctionComponent<HomeProps> = async ({ params: { locale } }) => {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider resources={resources} locale={locale} namespaces={i18nNamespaces}>
      <div>
        <h3>{t('signup:title')}</h3>
        <SignupForm />
      </div>
    </TranslationsProvider>
  );
};

export default Home;
