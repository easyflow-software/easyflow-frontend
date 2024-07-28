import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - EasyFlow',
  description: 'Our mission and vision',
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
