import LoginForm from '@/src/components/login-form/LoginForm';
import TranslationsProvider from '@/src/providers/translation-provider/TranslationsProvider';
import initTranslations from '@i18n';
import { Card, CardHeader } from '@nextui-org/react';
import { redirect } from 'next/navigation';
import { FunctionComponent } from 'react';
import { getUser } from '../actions';

interface HomeProps {
  params: {
    locale: string;
  };
}

const i18nNamespaces = ['login', 'errors'];

const Home: FunctionComponent<HomeProps> = async ({ params: { locale } }) => {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  // Check if user is already logged in
  const res = await getUser();
  if (res.success) {
    redirect('/chat');
  }

  return (
    <TranslationsProvider resources={resources} locale={locale} namespaces={i18nNamespaces}>
      <Card className="w-[80%] max-w-[500px] p-5">
        <CardHeader>
          <h3>{t('login:title')}</h3>
        </CardHeader>
        <LoginForm />
      </Card>
    </TranslationsProvider>
  );
};

export default Home;
