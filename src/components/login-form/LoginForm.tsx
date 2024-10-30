'use client';
import { UserContext } from '@/providers/user-provider/UserProvider';
import useLogin from '@/src/hooks/useLogin';
import { Button, Divider, Input, Link } from '@nextui-org/react';
import { WarningCircle } from '@phosphor-icons/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { FunctionComponent, ReactElement, useContext, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { APIOperation } from '../../services/api-services/common';
import { clientRequest } from '../../services/api-services/requests/client-side';
import PasswordInput from '../password-input/PasswordInput';
import createValidationSchema from './validation-schema';

const LoginForm: FunctionComponent = (): ReactElement => {
  const { t } = useTranslation();
  const router = useRouter();

  const { initialValues } = useLogin();
  const { refetchUser } = useContext(UserContext);

  const [error, setError] = useState<string>();

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
          const res = await clientRequest<APIOperation.LOGIN>({ op: APIOperation.LOGIN, payload: values });
          if (res.success) {
            await refetchUser();
            router.push('/chat');
          } else {
            setError(res.errorCode);
          }
        }}
      >
        {({ setFieldTouched, setFieldValue, values, errors, touched, isSubmitting, submitCount, isValid }) => (
          <Form>
            <Input
              classNames={{ base: 'mb-0.5', description: 'select-none' }}
              type="text"
              label={t('login:form.email.label')}
              placeholder={t('login:form.email.placeholder')}
              value={values.email}
              onChange={e => {
                void setFieldValue('email', e.target.value);
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
                void setFieldValue('password', e.target.value);
                setError(undefined);
              }}
              onInput={() => setError(undefined)}
              onBlur={() => setFieldTouched('password', true)}
              touched={!!touched.password}
              error={errors.password ? errors.password : undefined}
              isRequired
            />
            <Button
              color="primary"
              type="submit"
              isLoading={isSubmitting}
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
