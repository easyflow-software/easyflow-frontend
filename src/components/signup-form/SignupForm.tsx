'use client';
import { Button, CircularProgress, Divider, Input, Link } from '@nextui-org/react';
import { Copy, Download, WarningCircle } from '@phosphor-icons/react/dist/ssr';
import useSignup from '@src/hooks/useSignup';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { FunctionComponent, ReactElement, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ErrorCode } from '../../enums/error-codes.enum';
import CloudflareTurnstile from '../cloudflare-turnstile/CloudflareTurnstile';
import PasswordInput from '../password-input/PasswordInput';
import Step from '../progress-stepper/Step';
import Stepper, { StepperRef } from '../progress-stepper/Stepper';
import PasswordRequirement from './PasswordRequirement';
import createValidationSchema from './validation-schema';

const SignupForm: FunctionComponent = (): ReactElement => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    initialValues,
    hashedPassword,
    isGeneratingKeys,
    error,
    isLoading,
    turnstileTouched,
    turnstileToken,
    setTurnstileTouched,
    setTurnstileToken,
    setError,
    generateKeys,
    signup,
    checkIfUserExists,
    downloadRecoveryCode,
  } = useSignup();

  const stepperRef = useRef<StepperRef>(null);

  const validationSchema = createValidationSchema(t);

  router.prefetch('/login');

  return (
    <div className="p-3">
      <Stepper
        titles={[
          t('signup:stepperTitles.enterInformation'),
          t('signup:stepperTitles.confirmEmail'),
          t('signup:stepperTitles.recoveryCode'),
        ]}
        ref={stepperRef}
      >
        <Step>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async values => {
              void checkIfUserExists(values.email);
              if (!error) {
                stepperRef.current?.nextStep();
              }
            }}
          >
            {({ setFieldTouched, setFieldValue, values, errors, touched, isSubmitting, submitCount, isValid }) => (
              <Form>
                <Input
                  classNames={{ base: 'mb-0.5', description: 'select-none' }}
                  type="text"
                  label={t('signup:form.email.label')}
                  placeholder={t('signup:form.email.placeholder')}
                  value={values.email}
                  onInput={() => setError(undefined)}
                  onChange={e => setFieldValue('email', e.currentTarget.value)}
                  onBlur={() => setFieldTouched('email', true)}
                  isInvalid={touched.email && !!errors.email}
                  errorMessage={errors.email ? errors.email : undefined}
                  // random invisible character so that the input dosn't move when the erromessage gets displayed
                  description={'\u2800'}
                  isRequired
                />
                <Input
                  classNames={{ base: 'mb-0.5', description: 'select-none' }}
                  type="text"
                  label={t('signup:form.name.label')}
                  placeholder={t('signup:form.name.placeholder')}
                  value={values.name}
                  onInput={() => setError(undefined)}
                  onChange={e => setFieldValue('name', e.currentTarget.value)}
                  onBlur={() => setFieldTouched('name', true)}
                  isInvalid={touched.name && !!errors.name}
                  errorMessage={errors.name ? errors.name : undefined}
                  // random invisible character so that the input dosn't move when the erromessage gets displayed
                  description={'\u2800'}
                  isRequired
                />
                <PasswordInput
                  label={t('signup:form.password.label')}
                  value={values.password}
                  placeholder={t('signup:form.password.placeholder')}
                  onInput={() => setError(undefined)}
                  onChange={e => setFieldValue('password', e.currentTarget.value)}
                  onBlur={() => setFieldTouched('password', true)}
                  touched={touched.password}
                  error={errors.password}
                  isRequired
                />
                <PasswordInput
                  label={t('signup:form.confirmPassword.label')}
                  value={values.confirmPassword}
                  placeholder={t('signup:form.confirmPassword.placeholder')}
                  onInput={() => setError(undefined)}
                  onChange={e => setFieldValue('confirmPassword', e.currentTarget.value)}
                  onBlur={() => setFieldTouched('confirmPassword', true)}
                  touched={touched.confirmPassword}
                  error={errors.confirmPassword}
                  isRequired
                />
                <div className="mb-3">
                  <PasswordRequirement
                    regex={/[a-z]/}
                    password={values.password}
                    requirementText={t('signup:passwordRequirements.lowerCase')}
                  />
                  <PasswordRequirement
                    regex={/[A-Z]/}
                    password={values.password}
                    requirementText={t('signup:passwordRequirements.upperCase')}
                  />
                  <PasswordRequirement
                    regex={/\d/}
                    password={values.password}
                    requirementText={t('signup:passwordRequirements.number')}
                  />
                  <PasswordRequirement
                    regex={/[^\w\s]/}
                    password={values.password}
                    requirementText={t('signup:passwordRequirements.special')}
                  />
                  <PasswordRequirement
                    regex={/.{12,}/}
                    password={values.password}
                    requirementText={t('signup:passwordRequirements.minLength')}
                  />
                </div>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={isSubmitting}
                  isDisabled={submitCount > 0 && !isValid}
                  fullWidth
                >
                  {t('signup:next')}
                </Button>
              </Form>
            )}
          </Formik>
        </Step>
        <Step>
          <p>Email check to be done</p>
          <div className="flex">
            <Button
              className="mr-2 w-full"
              variant="bordered"
              color="default"
              onClick={() => stepperRef.current?.previousStep()}
            >
              {t('signup:back')}
            </Button>
            <Button
              className="ml-2 w-full"
              color="primary"
              onClick={async () => {
                stepperRef.current?.nextStep();
                await generateKeys();
              }}
            >
              {t('signup:next')}
            </Button>
          </div>
        </Step>
        <Step>
          <div className="flex min-h-48 flex-col justify-center">
            {isGeneratingKeys && (
              <div className="flex flex-col items-center">
                <CircularProgress aria-label="Loading Keys" className="mb-2" />
                <p>Generating your private Keys</p>
              </div>
            )}
            {!isGeneratingKeys && hashedPassword && (
              <>
                <h3>{t('signup:recoveryCode.title')}</h3>
                <Trans
                  className="mb-4"
                  components={{
                    strong: <strong />,
                    CopyLink: (
                      <Link
                        className="hover:cursor-pointer"
                        showAnchorIcon
                        anchorIcon={<Copy weight="bold" className="ml-1" />}
                        onClick={() => navigator.clipboard.writeText(hashedPassword)}
                      />
                    ),
                    DownloadLink: (
                      <Link
                        className="hover:cursor-pointer"
                        showAnchorIcon
                        anchorIcon={<Download weight="bold" className="ml-1" />}
                        onClick={downloadRecoveryCode}
                      />
                    ),
                  }}
                >
                  <p>{t('signup:recoveryCode.information')}</p>
                </Trans>
                <div className="mb-4" />
                <CloudflareTurnstile
                  setError={setError}
                  setFieldValue={setTurnstileToken}
                  setFieldTouched={() => setTurnstileTouched(true)}
                  value={turnstileToken}
                  invalid={turnstileTouched && !turnstileToken}
                  error={!turnstileToken ? t(`errors:${ErrorCode.INVALID_TURNSTILE}`) : undefined}
                  action="signup"
                />
                <div className="mt-2 flex">
                  <Button
                    className="mr-2 w-full"
                    variant="bordered"
                    color="default"
                    isDisabled={isGeneratingKeys}
                    onClick={() => stepperRef.current?.previousStep()}
                  >
                    {t('signup:back')}
                  </Button>
                  <Button
                    className="ml-2 w-full"
                    color="primary"
                    isDisabled={isGeneratingKeys}
                    isLoading={isLoading}
                    onClick={() => {
                      void signup();
                    }}
                  >
                    {t('signup:title')}
                  </Button>
                </div>
              </>
            )}
          </div>
        </Step>
      </Stepper>
      {error ? (
        <div className="mt-2 flex items-center text-danger">
          <WarningCircle size={20} className="mr-1" />
          <p>{t(`errors:${error}`)}</p>
        </div>
      ) : (
        <p className="mt-3"> </p>
      )}
      <Divider className="mt-2" />
      <p className="mt-5 text-center text-content4-foreground">
        <Trans
          i18nKey="signup:alreadyHaveAccount"
          components={{
            login: <Link className="hover:cursor-pointer" href="/login" underline="hover" />,
          }}
        />
      </p>
    </div>
  );
};

export default SignupForm;
