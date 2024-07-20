import { SignupType } from '../types/signup.type';

const useSignup = (): {
  initialValues: SignupType;
} => {
  const initialValues: SignupType = {
    email: undefined,
    name: undefined,
    password: undefined,
    confirmPassword: undefined,
  };

  return { initialValues };
};

export default useSignup;
