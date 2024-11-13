'use server';
import { Card, CardHeader } from '@nextui-org/react';
import initTranslations from '@src/app/i18n';
import LoginForm from '@src/components/login-form/LoginForm';
import TranslationsProvider from '@src/providers/translation-provider/TranslationsProvider';
import { APIOperation } from '@src/services/api-services/common';
import serverRequest from '@src/services/api-services/requests/server-side';
import { redirect } from 'next/navigation';
import { FunctionComponent } from 'react';

interface HomeProps {
  params: Promise<{
    locale: string;
  }>;
}

const i18nNamespaces = ['login', 'errors'];

const Home: FunctionComponent<HomeProps> = async props => {
  const res = await serverRequest<APIOperation.CHECK_LOGIN>({ op: APIOperation.CHECK_LOGIN });
  if (res.success) {
    redirect('/chat');
  }
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
