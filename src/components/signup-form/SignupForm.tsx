'use client';
import useSignup from '@/src/hooks/useSignup';
import { Button, CircularProgress, Input } from '@nextui-org/react';
import { Form, Formik } from 'formik';
import { FunctionComponent, ReactElement, useEffect, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Link from '../link/Link';
import PasswordInput from '../password-input/PasswordInput';
import Step from '../progress-stepper/Step';
import Stepper, { StepperRef } from '../progress-stepper/Stepper';
import PasswordRequirement from './PasswordRequirement';
import createValidationSchema from './validation-schema';

const SignupForm: FunctionComponent = (): ReactElement => {
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { initialValues, generateKeys, privateKey, publicKey, iv, isGeneratingKeys } = useSignup();

  const stepperRef = useRef<StepperRef>(null);

  const validationSchema = createValidationSchema(t);

  useEffect(() => {
    console.log(stepperRef.current?.currentStep);
  }, [stepperRef.current?.currentStep]);

  return (
    // TODO: Wording and translations
    <Stepper titles={['Enter information', 'Confirm Email Address', 'Save Information']} ref={stepperRef}>
      <Step>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async () => {
            stepperRef.current?.nextStep();
          }}
        >
          {({ setFieldTouched, setFieldValue, values, errors, touched, isSubmitting, submitCount, isValid }) => (
            <Form>
              <Input
                className="mb-3"
                type="text"
                label={t('signup:form.email.label')}
                placeholder={t('signup:form.email.placeholder')}
                value={values.email}
                onChange={e => setFieldValue('email', e.target.value)}
                onBlur={() => setFieldTouched('email', true)}
                isInvalid={touched.email && !!errors.email}
                errorMessage={errors.email ? errors.email : undefined}
                isRequired
              />
              <Input
                className="mb-3"
                type="text"
                label={t('signup:form.name.label')}
                placeholder={t('signup:form.name.placeholder')}
                value={values.name}
                onChange={e => setFieldValue('name', e.target.value)}
                onBlur={() => setFieldTouched('name', true)}
                isInvalid={touched.name && !!errors.name}
                errorMessage={errors.name ? errors.name : undefined}
                isRequired
              />
              <PasswordInput
                label={t('signup:form.password.label')}
                value={values.password}
                placeholder={t('signup:form.password.placeholder')}
                onChange={e => setFieldValue('password', e.target.value)}
                onBlur={() => setFieldTouched('password', true)}
                touched={touched.password}
                error={errors.password}
              />
              <PasswordInput
                label={t('signup:form.confirmPassword.label')}
                value={values.confirmPassword}
                placeholder={t('signup:form.confirmPassword.placeholder')}
                onChange={e => setFieldValue('confirmPassword', e.target.value)}
                onBlur={() => setFieldTouched('confirmPassword', true)}
                touched={touched.confirmPassword}
                error={errors.confirmPassword}
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
              <p className="mt-5 text-center text-content4-foreground">
                <Trans
                  i18nKey="signup:alreadyHaveAccount"
                  components={{
                    login: <Link className="hover:cursor-pointer" href="/login" underline="hover" />,
                  }}
                />
              </p>
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
          <Button className="ml-2 w-full" color="primary" onClick={() => stepperRef.current?.nextStep()}>
            {t('signup:next')}
          </Button>
        </div>
      </Step>
      <Step>
        {isGeneratingKeys ? (
          <>
            <CircularProgress aria-label="Loading Keys" />
            <p>Generating Keys</p>
          </>
        ) : (
          <p>Keys generated</p>
        )}
        <div className="flex">
          <Button
            className="mr-2 w-full"
            variant="bordered"
            color="default"
            onClick={() => stepperRef.current?.previousStep()}
          >
            {t('signup:back')}
          </Button>
          <Button className="ml-2 w-full" color="primary" onClick={() => stepperRef.current?.nextStep()}>
            {t('signup:next')}
          </Button>
        </div>
      </Step>
    </Stepper>
  );
};

export default SignupForm;
