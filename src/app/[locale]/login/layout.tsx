'use server';
import type { Metadata } from 'next';

import type { FunctionComponent, PropsWithChildren, ReactElement } from 'react';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Login - EasyFlow',
    description: 'Login to EasyFlow',
  };
};

const RootLayout: FunctionComponent<PropsWithChildren> = async ({ children }): Promise<ReactElement> => {
  return <main className="flex min-h-[calc(100vh-65px)] w-screen items-center justify-center">{children}</main>;
};

export default RootLayout;
