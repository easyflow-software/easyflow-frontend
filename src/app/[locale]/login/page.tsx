'use server';
import { Card, CardHeader } from '@nextui-org/react';
import initTranslations from '@src/app/i18n';
import LoginForm from '@src/components/login-form/LoginForm';
import TranslationsProvider from '@src/providers/translation-provider/TranslationsProvider';
import { APIOperation } from '@src/services/api-services/common';
import serverRequest from '@src/services/api-services/requests/server-side';
import { ParamsType } from '@src/types/params.type';
import { redirect } from 'next/navigation';
import { FunctionComponent } from 'react';

const i18nNamespaces = ['login', 'errors'];

const Home: FunctionComponent<ParamsType> = async ({ params }) => {
  const res = await serverRequest<APIOperation.CHECK_LOGIN>({ op: APIOperation.CHECK_LOGIN });
  if (res.success) {
    redirect('/chat');
  }

  const { locale } = await params;

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
