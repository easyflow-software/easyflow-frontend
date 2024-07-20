import LoginForm from '@/src/components/login-form/LoginForm';
import TranslationsProvider from '@/src/components/translation-provider/TranslationsProvider';
import initTranslations from '@i18n';
import { Card, CardHeader } from '@nextui-org/react';
import { FunctionComponent } from 'react';

interface HomeProps {
  params: {
    locale: string;
  };
}

const i18nNamespaces = ['login'];

const Home: FunctionComponent<HomeProps> = async ({ params: { locale } }) => {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider resources={resources} locale={locale} namespaces={i18nNamespaces}>
      <Card className="w-[80%] max-w-[500px] p-5">
        <CardHeader>{t('login:title')}</CardHeader>
        <LoginForm />
      </Card>
    </TranslationsProvider>
  );
};

export default Home;
