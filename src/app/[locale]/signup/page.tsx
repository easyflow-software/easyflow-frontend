'use server';
import SignupForm from '@/src/components/signup-form/SignupForm';
import TranslationsProvider from '@/src/providers/translation-provider/TranslationsProvider';
import initTranslations from '@i18n';
import { Card, CardHeader } from '@nextui-org/react';
import { FunctionComponent } from 'react';

interface HomeProps {
  params: {
    locale: string;
  };
}

const i18nNamespaces = ['signup', 'errors'];

const Home: FunctionComponent<HomeProps> = async ({ params: { locale } }) => {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider resources={resources} locale={locale} namespaces={i18nNamespaces}>
      <div>
        <Card className="m-5 w-[80vw] max-w-[500px] p-5">
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
