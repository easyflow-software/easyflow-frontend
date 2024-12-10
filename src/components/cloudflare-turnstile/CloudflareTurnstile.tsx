'use client';
import { ErrorCode } from '@src/enums/error-codes.enum';
import { useTheme } from 'next-themes';
import { Dispatch, FunctionComponent, ReactElement, SetStateAction } from 'react';
import Turnstile from 'react-turnstile';

interface CloudflareTurnstileProps {
  setError: Dispatch<SetStateAction<ErrorCode | undefined>>;
  setFieldValue: Dispatch<string>;
  setFieldTouched: () => void;
  value?: string;
  invalid?: boolean;
  error?: string;
  action: string;
}

const CloudflareTurnstile: FunctionComponent<CloudflareTurnstileProps> = ({
  setError,
  setFieldValue,
  setFieldTouched,
  value,
  invalid,
  error,
  action,
}): ReactElement => {
  const { theme } = useTheme();
  return (
    <div className="mb-2">
      <Turnstile
        sitekey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_KEY ?? ''}
        theme={theme as 'light' | 'dark'}
        action={action}
        onVerify={token => {
          void setFieldTouched();
          void setFieldValue(token);
        }}
        size="flexible"
        onUnsupported={() => setError(ErrorCode.UNSUPPORTED_BROWSER)}
        fixedSize
      />
      <input type="hidden" name="turnstileToken" value={value} onChange={() => setError(undefined)} />
      <p className="text-tiny text-danger mt-1">{invalid ? error : '\u2800'}</p>
    </div>
  );
};

export default CloudflareTurnstile;
