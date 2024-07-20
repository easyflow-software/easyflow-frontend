import { TFunction } from 'i18next';
import { object, string } from 'yup';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const createValidationSchema = (t: TFunction) => {
  return object().shape({
    email: string().required(t('validation.email.required')).email(t('validation.email.invalid')),
    name: string().required(t('validation.name.required')),
    password: string()
      .required(t('validation.password.required'))
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{12,}$/g, t('validation.password.invalid')),
    confirmPassword: string()
      .required(t('validation.confirmPassword.required'))
      .test('passwords-match', t('validation.confirmPassword.match'), function (value) {
        return this.parent.password === value;
      }),
  });
};

export default createValidationSchema;
