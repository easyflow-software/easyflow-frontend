import SignupForm from '@/src/components/signup-form/SignupForm';
import TranslationsProvider from '@/src/components/translation-provider/TranslationsProvider';
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

const i18nNamespaces = ['signup'];

const Home: FunctionComponent<HomeProps> = async ({ params: { locale } }) => {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  // Check if user is already logged in
  const res = await getUser();
  if (res.success) {
    redirect('/chat');
  }

  return (
    <TranslationsProvider resources={resources} locale={locale} namespaces={i18nNamespaces}>
      <div>
        <Card className="w-[80vw] max-w-[500px] p-5">
          <CardHeader>
            <h3>{t('signup:title')}</h3>
          </CardHeader>
          <SignupForm />
        </Card>
      </div>
    </TranslationsProvider>
  );
};

export default Home;
