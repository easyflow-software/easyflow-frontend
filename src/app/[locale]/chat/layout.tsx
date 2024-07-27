import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat - EasyFlow',
  description: 'Chat privatly with EasyFlow',
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
