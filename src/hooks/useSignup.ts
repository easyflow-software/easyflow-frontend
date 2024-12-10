'use client';
import { APIOperation } from '@src/services/api-services/common';
import { clientRequest } from '@src/services/api-services/requests/client-side';
import { Signup } from '@src/types/signup.type';
import {
  arrayBufferToBase64,
  generateAsymetricKeys,
  generateWrapingKey,
  getRandomValues,
  hash,
  stringifyKey,
  uint8ToBase64,
  wrapKey,
} from '@src/utils/encryption-utils';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import { ErrorCode } from '../enums/error-codes.enum';

const useSignup = (): {
  initialValues: Signup;
  privateKey?: string;
  publicKey?: string;
  iv?: string;
  hashedPassword?: string;
  isGeneratingKeys: boolean;
  error?: ErrorCode;
  isLoading: boolean;
  turnstileTouched: boolean;
  turnstileToken?: string;
  setError: Dispatch<SetStateAction<ErrorCode | undefined>>;
  setTurnstileToken: Dispatch<SetStateAction<string | undefined>>;
  setTurnstileTouched: Dispatch<SetStateAction<boolean>>;
  generateKeys: (password?: string) => Promise<void>;
  signup: (email?: string, name?: string, password?: string) => Promise<void>;
  checkIfUserExists: (email?: string) => Promise<void>;
  downloadRecoveryCode: () => void;
} => {
  const router = useRouter();

  const [privateKey, setPrivateKey] = useState<string>();
  const [publicKey, setPublicKey] = useState<string>();
  const [iv, setIv] = useState<string>();
  const [hashedPassword, setHashedPassword] = useState<string>();

  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorCode>();

  const [turnstileToken, setTurnstileToken] = useState<string>();
  const [turnstileTouched, setTurnstileTouched] = useState<boolean>(false);

  const initialValues: Signup = {
    email: undefined,
    name: undefined,
    password: undefined,
    confirmPassword: undefined,
    turnstileToken: undefined,
  };

  const [values, setValues] = useState(initialValues);

  const generateKeys = async (): Promise<void> => {
    if (!values.password) return;
    setIsGeneratingKeys(true);
    const { publicKey, privateKey } = await generateAsymetricKeys();

    // Iv for encryption of the private key
    const ivBuffer = getRandomValues();

    // Hash Password
    const hashedPassword = await hash(values.password, ivBuffer);

    const wrapingKey = await generateWrapingKey(hashedPassword);

    // Encrypt the private key for storage in the database
    const wrapedPrivateKey = await wrapKey(privateKey, wrapingKey, ivBuffer);

    // Stringify the keys and iv so they can be send via JSON
    const publicKeyString = await stringifyKey('spki', publicKey);
    const privateKeyString = arrayBufferToBase64(wrapedPrivateKey);
    const ivString = uint8ToBase64(ivBuffer);
    const hashedPasswordString = arrayBufferToBase64(hashedPassword);

    setPrivateKey(privateKeyString);
    setPublicKey(publicKeyString);
    setIv(ivString);
    setHashedPassword(hashedPasswordString);
    setIsGeneratingKeys(false);
  };

  const signup = async (): Promise<void> => {
    setIsLoading(true);
    if (!turnstileToken) {
      setTurnstileTouched(true);
      setIsLoading(false);
      return;
    }
    const res = await clientRequest<APIOperation.SIGNUP>({
      op: APIOperation.SIGNUP,
      payload: {
        email: values.email,
        password: values.password,
        name: values.name,
        privateKey,
        publicKey,
        iv,
        turnstileToken,
      },
    });
    if (res.success) {
      void router.push('/login');
    } else {
      setError(res.errorCode);
      setIsLoading(false);
    }
  };

  const checkIfUserExists = async (email?: string): Promise<void> => {
    const res = await clientRequest<APIOperation.CHECK_IF_USER_EXISTS>({
      op: APIOperation.CHECK_IF_USER_EXISTS,
      params: { email },
    });
    if (!res.success) {
      setError(res.errorCode);
      return;
    } else if (res.data === true) {
      setError(ErrorCode.ALREADY_EXISTS);
      return;
    }
    setValues(values);
  };

  const downloadRecoveryCode = (): void => {
    const element = document.createElement('a');
    const file = new Blob([hashedPassword ?? ''], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'easyflow-recovery-code.txt';
    document.body.appendChild(element); // Required for this to work in Firefox
    element.click();
  };

  return {
    initialValues,
    isGeneratingKeys,
    hashedPassword,
    error,
    isLoading,
    turnstileTouched,
    turnstileToken,
    setError,
    setTurnstileToken,
    setTurnstileTouched,
    generateKeys,
    signup,
    checkIfUserExists,
    downloadRecoveryCode,
  };
};

export default useSignup;
