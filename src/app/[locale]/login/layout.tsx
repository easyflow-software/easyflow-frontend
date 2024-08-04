import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - EasyFlow',
  description: 'Login to EasyFlow',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>): JSX.Element => {
  return <main className="flex min-h-[calc(100vh-65px)] w-screen items-center justify-center">{children}</main>;
};

export default RootLayout;
