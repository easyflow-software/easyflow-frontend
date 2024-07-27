import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile - EasyFlow',
  description: 'Your profile on EasyFlow',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>): JSX.Element => {
  return <main className="h-full w-screen">{children}</main>;
};

export default RootLayout;
