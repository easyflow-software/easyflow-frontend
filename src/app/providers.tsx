import { NextUIProvider } from '@nextui-org/react';
import { FunctionComponent, PropsWithChildren } from 'react';

const Providers: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return <NextUIProvider>{children}</NextUIProvider>;
};

export default Providers;
