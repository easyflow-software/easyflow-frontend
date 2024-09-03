'use client';
import { getProfilePicture } from '@/src/app/[locale]/actions';
import useLogin from '@/src/hooks/useLogin';
import { UserContext } from '@/src/providers/user-provider/UserProvider';
import { Button, Divider, Input, Link } from '@nextui-org/react';
import { WarningCircle } from '@phosphor-icons/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { FunctionComponent, ReactElement, useContext, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import PasswordInput from '../password-input/PasswordInput';
import createValidationSchema from './validation-schema';

const LoginForm: FunctionComponent = (): ReactElement => {
  const { t } = useTranslation();
  const { setUser, setProfilePicture } = useContext(UserContext);
  const { initialValues, login } = useLogin();
  const router = useRouter();

  const [error, setError] = useState<string>();

  const validationSchema = createValidationSchema(t);

  useEffect(() => {
    // set the user to undefined when the component loads so the avatar is not displayed
    // It isn't possible anways to get on the page when you are logged in
    setUser(undefined);
    setProfilePicture(undefined);
  }, [setUser, setProfilePicture]);

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async values => {
          const res = await login(values.email, values.password);
          if (!res.success) {
            setError(t(`errors:${res.errorCode}`));
          } else {
            setUser(res.data);
            const profilePictureRes = await getProfilePicture();
            if (!profilePictureRes.success) {
              console.log('Failed to get profile picture');
            } else {
              setProfilePicture(profilePictureRes.data || undefined);
            }
            router.push('/chat');
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
                setError(undefined);
              }}
              onBlur={() => setFieldTouched('email', true)}
              isInvalid={touched.email && !!errors.email}
              errorMessage={errors.email ? errors.email : undefined}
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
            {error ? (
              <div className="mt-2 flex items-center text-danger">
                <WarningCircle size={20} className="mr-1" />
                <p>{error}</p>
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
