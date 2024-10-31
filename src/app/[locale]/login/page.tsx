'use server';
import initTranslations from '@app/i18n';
import LoginForm from '@components/login-form/LoginForm';
import { Card, CardHeader } from '@nextui-org/react';
import TranslationsProvider from '@providers/translation-provider/TranslationsProvider';
import { FunctionComponent } from 'react';

interface HomeProps {
  params: Promise<{
    locale: string;
  }>;
}

const i18nNamespaces = ['login', 'errors'];

const Home: FunctionComponent<HomeProps> = async props => {
  const params = await props.params;

  const { locale } = params;

  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider resources={resources} locale={locale} namespaces={i18nNamespaces}>
      <Card className="m-5 w-[80%] max-w-[500px] p-5">
        <CardHeader>
          <h3>{t('login:title')}</h3>
        </CardHeader>
        <LoginForm />
      </Card>
    </TranslationsProvider>
  );
};

export default Home;
