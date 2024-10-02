import type { Metadata } from 'next';
import { ReactElement, ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Login - EasyFlow',
  description: 'Login to EasyFlow',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
  params: { locale: string };
}>): ReactElement => {
  return <main className="flex min-h-[calc(100vh-65px)] w-screen items-center justify-center">{children}</main>;
};

export default RootLayout;
