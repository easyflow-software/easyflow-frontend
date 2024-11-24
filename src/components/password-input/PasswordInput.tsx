'use client';

import { Input, InputProps } from '@nextui-org/react';
import { Eye, EyeSlash } from '@phosphor-icons/react/dist/ssr';
import { FunctionComponent, ReactElement, useState } from 'react';

interface PasswordInputProps
  extends Omit<InputProps, 'type' | 'onCopy' | 'description' | 'endContent' | 'errorMessage' | 'isInvalid'> {
  touched?: boolean;
  error?: string;
}

const PasswordInput: FunctionComponent<PasswordInputProps> = ({ touched, error, ...props }): ReactElement => {
  const [shown, setShown] = useState(false);
  return (
    <Input
      classNames={{ base: 'mb-0.5', description: 'select-none' }}
      {...props}
      type={shown ? 'text' : 'password'}
      onCopy={e => e.preventDefault()}
      isInvalid={touched && !!error}
      errorMessage={error}
      // random invisible character so that the input dosn't move when the erromessage gets displayed
      description={'\u2800'}
      endContent={
        shown ? (
          <Eye className="hover:cursor-pointer" onClick={() => setShown(false)} />
        ) : (
          <EyeSlash className="hover:cursor-pointer" onClick={() => setShown(true)} />
        )
      }
    />
  );
};

export default PasswordInput;
