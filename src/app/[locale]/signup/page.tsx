'use server';
import SignupForm from '@/components/signup-form/SignupForm';
import TranslationsProvider from '@/providers/translation-provider/TranslationsProvider';
import initTranslations from '@app/i18n';
import { Card, CardHeader } from '@nextui-org/react';
import { FunctionComponent } from 'react';
import { HomeProps } from '../page';

const i18nNamespaces = ['signup', 'errors'];

const Home: FunctionComponent<HomeProps> = async props => {
  const params = await props.params;

  const { locale } = params;

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
