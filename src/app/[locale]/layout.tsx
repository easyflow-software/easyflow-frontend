import cx from 'classnames';
import { dir } from 'i18next';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { FunctionComponent, PropsWithChildren, ReactElement } from 'react';
import Nav from '../../components/nav/Nav';
import NavWrapper from '../../components/nav/NavBarWrapper';
import ClientProvider from '../../providers/client-provider/ClientProvider';
import '../globals.css';
import '../i18n';
import initTranslations from '../i18n';

const inter = Inter({ subsets: ['latin'] });

const i18nNamespaces = ['metadata'];

export interface Props {
  params: Promise<{
    locale: string;
  }>;
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params;
  const i18n = await initTranslations(locale, i18nNamespaces);
  return {
    title: i18n.t('metadata:home.title'),
    description: i18n.t('metadata:home.description'),
  };
};

const RootLayout: FunctionComponent<PropsWithChildren<Props>> = async (props): Promise<ReactElement> => {
  const { locale } = await props.params;

  const { children } = props;

  return (
    <html lang={locale} dir={dir(locale)} className="h-full w-full">
      <body className={cx('h-full w-full bg-background', inter.className)}>
        <ClientProvider>
          <NavWrapper params={{ locale }}>
            <Nav params={{ locale }} />
          </NavWrapper>
          <div className="h-full overflow-y-auto">{children}</div>
        </ClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
