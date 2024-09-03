'use client';

import { Input } from '@nextui-org/react';
import { Eye, EyeSlash } from '@phosphor-icons/react';
import { ChangeEvent, FunctionComponent, ReactElement, useState } from 'react';

interface PasswordInputProps {
  label: string;
  value?: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  touched?: boolean;
  error?: string;
}

const PasswordInput: FunctionComponent<PasswordInputProps> = ({
  label,
  value,
  placeholder,
  onChange,
  onBlur,
  touched,
  error,
}): ReactElement => {
  const [shown, setShown] = useState(false);
  return (
    <Input
      classNames={{ base: 'mb-0.5', description: 'select-none' }}
      label={label}
      type={shown ? 'text' : 'password'}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      onBlur={onBlur}
      onCopy={e => e.preventDefault()}
      isInvalid={touched && !!error}
      errorMessage={error}
      endContent={
        shown ? (
          <Eye className="hover:cursor-pointer" onClick={() => setShown(false)} />
        ) : (
          <EyeSlash className="hover:cursor-pointer" onClick={() => setShown(true)} />
        )
      }
      isRequired
    />
  );
};

export default PasswordInput;
