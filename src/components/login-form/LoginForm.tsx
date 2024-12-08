'use client';
import { Button, Divider, Input, Link } from '@nextui-org/react';
import { WarningCircle } from '@phosphor-icons/react/dist/ssr';
import useLogin from '@src/hooks/useLogin';
import { UserContext } from '@src/providers/user-provider/UserProvider';
import { Form, Formik } from 'formik';
import { useRouter, useSearchParams } from 'next/navigation';
import { FunctionComponent, ReactElement, useContext, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import CloudflareTurnstile from '../cloudflare-turnstile/CloudflareTurnstile';
import PasswordInput from '../password-input/PasswordInput';
import createValidationSchema from './validation-schema';

const LoginForm: FunctionComponent = (): ReactElement => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { initialValues, login } = useLogin();
  const { refetchUser } = useContext(UserContext);

  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validationSchema = createValidationSchema(t);

  useEffect(() => {
    router.prefetch('/signup');
    router.prefetch('/chat');
  }, []);

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async values => {
          setIsLoading(true);
          const res = await login(values);
          if (res.success) {
            void refetchUser();
            router.replace(searchParams.get('callback') ?? '/chat');
            router.refresh();
          } else {
            setError(res.errorCode);
            setIsLoading(false);
          }
        }}
      >
        {({ setFieldTouched, setFieldValue, values, errors, touched, submitCount, isValid }) => (
          <Form>
            <Input
              classNames={{ base: 'mb-0.5', description: 'select-none' }}
              type="text"
              label={t('login:form.email.label')}
              placeholder={t('login:form.email.placeholder')}
              value={values.email}
              onChange={e => {
                void setFieldValue('email', e.currentTarget.value);
              }}
              onInput={() => setError(undefined)}
              onBlur={() => setFieldTouched('email', true)}
              isInvalid={touched.email && !!errors.email}
              errorMessage={errors.email ? errors.email : undefined}
              // random invisible character so that the input doesn't move when the erromessage gets displayed
              description={'\u2800'}
              isRequired
            />
            <PasswordInput
              label={t('login:form.password.label')}
              value={values.password}
              placeholder={t('login:form.password.placeholder')}
              onChange={e => {
                void setFieldValue('password', e.currentTarget.value);
                setError(undefined);
              }}
              onInput={() => setError(undefined)}
              onBlur={() => setFieldTouched('password', true)}
              touched={!!touched.password}
              error={errors.password ? errors.password : undefined}
              isRequired
            />
            <CloudflareTurnstile
              setError={setError}
              setFieldValue={(value: string) => void setFieldValue('turnstileToken', value)}
              setFieldTouched={() => setFieldTouched('turnstileToken', true)}
              value={values.turnstileToken}
              invalid={touched.turnstileToken && !!errors.turnstileToken}
              error={errors.turnstileToken ? errors.turnstileToken : undefined}
              action="login"
            />
            <Button
              color="primary"
              type="submit"
              isLoading={isLoading}
              isDisabled={submitCount > 0 && !isValid}
              fullWidth
            >
              {t('login:title')}
            </Button>
            {error ? (
              <div className="mt-2 flex items-center text-danger">
                <WarningCircle size={20} className="mr-1" />
                <p>{t(`errors:${error}`)}</p>
              </div>
            ) : (
              <p className="mt-2"> </p>
            )}
          </Form>
        )}
      </Formik>
      <Divider className="mt-2" />
      <p className="mt-5 text-center text-content4-foreground">
        <Trans
          i18nKey="login:noAccount"
          components={{
            signup: <Link className="hover:cursor-pointer" href="/signup" underline="hover" />,
          }}
        />
      </p>
    </>
  );
};

export default LoginForm;
