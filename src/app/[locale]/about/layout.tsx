import type { Metadata } from 'next';
import { ReactElement, ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'About - EasyFlow',
  description: 'Our mission and vision',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
  params: { locale: string };
}>): ReactElement => {
  return <main className="h-full w-screen">{children}</main>;
};

export default RootLayout;
