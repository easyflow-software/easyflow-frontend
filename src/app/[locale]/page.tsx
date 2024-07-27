import TranslationsProvider from '@/src/providers/translation-provider/TranslationsProvider';
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
    <TranslationsProvider resources={resources} namespaces={i18nNamespaces} locale={locale}>
      <div className="m-2">
        <Button className="m-1" color="primary">
          {t('home:button')}
        </Button>
        <Button className="m-1" color="secondary">
          {t('home:button')}
        </Button>
        <Button className="m-1" color="success">
          {t('home:button')}
        </Button>
        <Button className="m-1" color="warning">
          {t('home:button')}
        </Button>
        <Button className="m-1" color="danger">
          {t('home:button')}
        </Button>
      </div>
      <div className="m-2">
        <Button className="m-1" color="primary" variant="faded">
          {t('home:button')}
        </Button>
        <Button className="m-1" color="secondary" variant="faded">
          {t('home:button')}
        </Button>
        <Button className="m-1" color="success" variant="faded">
          {t('home:button')}
        </Button>
        <Button className="m-1" color="warning" variant="faded">
          {t('home:button')}
        </Button>
        <Button className="m-1" color="danger" variant="faded">
          {t('home:button')}
        </Button>
      </div>
      <div className="m-2">
        <Button className="m-1" color="primary" variant="bordered">
          {t('home:button')}
        </Button>
        <Button className="m-1" color="secondary" variant="bordered">
          {t('home:button')}
        </Button>
        <Button className="m-1" color="success" variant="bordered">
          {t('home:button')}
        </Button>
        <Button className="m-1" color="warning" variant="bordered">
          {t('home:button')}
        </Button>
        <Button className="m-1" color="danger" variant="bordered">
          {t('home:button')}
        </Button>
      </div>
      <div className="m-2">
        <Button className="m-1" color="primary" variant="light">
          {t('home:button')}
        </Button>
        <Button className="m-1" color="secondary" variant="light">
          {t('home:button')}
        </Button>
        <Button className="m-1" color="success" variant="light">
          {t('home:button')}
        </Button>
        <Button className="m-1" color="warning" variant="light">
          {t('home:button')}
        </Button>
        <Button className="m-1" color="danger" variant="light">
          {t('home:button')}
        </Button>
      </div>
      <div className="m-2">
        <Button className="m-1" color="primary" variant="flat">
          {t('home:button')}
        </Button>
        <Button className="m-1" color="secondary" variant="flat">
          {t('home:button')}
        </Button>
        <Button className="m-1" color="success" variant="flat">
          {t('home:button')}
        </Button>
        <Button className="m-1" color="warning" variant="flat">
          {t('home:button')}
        </Button>
        <Button className="m-1" color="danger" variant="flat">
          {t('home:button')}
        </Button>
      </div>
      <div className="m-2">
        <Button className="m-1" color="primary" variant="ghost">
          {t('home:button')}
        </Button>
        <Button className="m-1" color="secondary" variant="ghost">
          {t('home:button')}
        </Button>
        <Button className="m-1" color="success" variant="ghost">
          {t('home:button')}
        </Button>
        <Button className="m-1" color="warning" variant="ghost">
          {t('home:button')}
        </Button>
        <Button className="m-1" color="danger" variant="ghost">
          {t('home:button')}
        </Button>
      </div>
      <div className="m-2">
        <Button className="m-1" color="primary" variant="shadow">
          {t('home:button')}
        </Button>
        <Button className="m-1" color="secondary" variant="shadow">
          {t('home:button')}
        </Button>
        <Button className="m-1" color="success" variant="shadow">
          {t('home:button')}
        </Button>
        <Button className="m-1" color="warning" variant="shadow">
          {t('home:button')}
        </Button>
        <Button className="m-1" color="danger" variant="shadow">
          {t('home:button')}
        </Button>
      </div>
    </TranslationsProvider>
  );
};

export default Home;
