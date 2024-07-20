import { TFunction } from 'i18next';
import { object, string } from 'yup';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const createValidationSchema = (t: TFunction) => {
  return object().shape({
    email: string().required(t('validation.email.required')).email(t('validation.email.invalid')),
    password: string().required(t('validation.password.required')),
  });
};

export default createValidationSchema;
