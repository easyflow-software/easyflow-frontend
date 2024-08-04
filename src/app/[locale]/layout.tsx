import Nav from '@/src/components/nav/Nav';
import NavWrapper from '@/src/components/nav/NavBarWrapper';
import cx from 'classnames';
import { dir } from 'i18next';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { FunctionComponent, PropsWithChildren, ReactElement } from 'react';
import '../globals.css';
import '../i18n';
import Providers from '../providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EasyFlow Chat',
  description: 'The private chat app',
};

interface RootLayoutProps {
  params: {
    locale: string;
  };
}

const RootLayout: FunctionComponent<PropsWithChildren<RootLayoutProps>> = ({
  children,
  params: { locale },
}): ReactElement => {
  return (
    <html lang={locale} dir={dir(locale)} className="h-full w-full">
      <body className={cx('h-full w-full bg-background', inter.className)}>
        <Providers>
          <NavWrapper params={{ locale }}>
            <Nav params={{ locale }} />
          </NavWrapper>
          <div className="h-full overflow-y-auto">{children}</div>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
