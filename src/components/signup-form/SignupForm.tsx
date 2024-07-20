'use client';
import useSignup from '@/src/hooks/useSignup';
import { Button, Card, CardHeader, Input, Link } from '@nextui-org/react';
import { Form, Formik } from 'formik';
import { createRef, FunctionComponent, ReactElement } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import PasswordInput from '../password-input/PasswordInput';
import Stepper, { StepperRef } from '../progress-stepper/Stepper';
import PasswordRequirement from './PasswordRequirement';
import createValidationSchema from './validation-schema';

const SignupForm: FunctionComponent = (): ReactElement => {
  const { t } = useTranslation();
  const { initialValues } = useSignup();

  const stepperRef = createRef<StepperRef>();

  const validationSchema = createValidationSchema(t);

  return (
    <Stepper ref={stepperRef}>
      <Card className="w-[80vw] max-w-[500px] p-5">
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
                {t('signup:title')}
              </Button>
            </Form>
          )}
        </Formik>
        <p className="mt-5 text-center text-content4-foreground">
          <Trans
            i18nKey="signup:alreadyHaveAccount"
            components={{
              login: <Link href="/login" underline="hover" />,
            }}
          />
        </p>
      </Card>
      <Card className="w-[80vw] max-w-[500px] p-5">
        <CardHeader>{t('signup:title')}</CardHeader>
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
                {t('signup:title')}
              </Button>
            </Form>
          )}
        </Formik>
        <p className="mt-5 text-center text-content4-foreground">
          <Trans
            i18nKey="signup:alreadyHaveAccount"
            components={{
              login: <Link href="/login" underline="hover" />,
            }}
          />
        </p>
      </Card>
    </Stepper>
  );
};

export default SignupForm;
