import { FunctionComponent, PropsWithChildren } from 'react';

// Just a wrapper component to be used in the ProgressStepper component dosn't do anything
const Step: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return <div>{children}</div>;
};

export default Step;
