'use server';
import type { Metadata } from 'next';

import type { FunctionComponent, PropsWithChildren, ReactElement } from 'react';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Profile - EasyFlow',
    description: 'Your profile on EasyFlow',
  };
};


const RootLayout: FunctionComponent<PropsWithChildren> = async ({ children }): Promise<ReactElement> => {
  return <main className="h-full w-screen">{children}</main>;
};

export default RootLayout;
