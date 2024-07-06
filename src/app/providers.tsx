import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider } from 'next-themes';
import { FunctionComponent, PropsWithChildren } from 'react';

const Providers: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <NextUIProvider>
      <ThemeProvider attribute="class" defaultTheme="dark">
        {children}
      </ThemeProvider>
    </NextUIProvider>
  );
};

export default Providers;
