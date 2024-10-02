import type { Metadata } from 'next';
import { ReactElement, ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Chat - EasyFlow',
  description: 'Chat privatly with EasyFlow',
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
