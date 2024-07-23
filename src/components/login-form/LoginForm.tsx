'use client';
import { login } from '@/src/app/[locale]/login/actions';
import { LoginType } from '@/src/types/login.type';
import { Button, Input, Link } from '@nextui-org/react';
import { Form, Formik } from 'formik';
import { FunctionComponent, ReactElement } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import PasswordInput from '../password-input/PasswordInput';
import createValidationSchema from './validation-schema';

const LoginForm: FunctionComponent = (): ReactElement => {
  const { t } = useTranslation();

  const validationSchema = createValidationSchema(t);

  const initialValues: LoginType = {
    email: undefined,
    password: undefined,
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async values => {
          const res = await login(values.email, values.password);
          if (!res.success) {
            console.log(res.errorCode);
          } else {
            console.log('Login success');
          }
        }}
      >
        {({ setFieldTouched, setFieldValue, values, errors, touched, isSubmitting, submitCount, isValid }) => (
          <Form>
            <Input
              className="mb-3"
              type="text"
              label={t('login:form.email.label')}
              placeholder={t('login:form.email.placeholder')}
              value={values.email}
              onChange={e => setFieldValue('email', e.target.value)}
              onBlur={() => setFieldTouched('email', true)}
              isInvalid={touched.email && !!errors.email}
              errorMessage={errors.email ? errors.email : undefined}
              isRequired
            />
            <PasswordInput
              label={t('login:form.password.label')}
              value={values.password}
              placeholder={t('login:form.password.placeholder')}
              onChange={e => setFieldValue('password', e.target.value)}
              onBlur={() => setFieldTouched('password', true)}
              touched={!!touched.password}
              error={errors.password ? errors.password : undefined}
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
          </Form>
        )}
      </Formik>

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
