'use client';
import { APIOperation } from '@src/services/api-services/common';
import { clientRequest } from '@src/services/api-services/requests/client-side';
import { RequestResponse } from '@src/types/request-response.type';
import { SignupResponse } from '@src/types/response.types';
import { SignupType } from '@src/types/signup.type';
import {
  arrayBufferToBase64,
  generateWrappingKey,
  hash,
  stringifyKey,
  uint8ToBase64,
} from '@src/utils/encryption-utils';
import { useState } from 'react';

const useSignup = (): {
  initialValues: SignupType;
  generateKeys: (password?: string) => Promise<void>;
  signup: (
    turnstileToken: string,
    email?: string,
    name?: string,
    password?: string,
  ) => Promise<RequestResponse<SignupResponse>>;
  checkIfUserExists: (email?: string) => Promise<RequestResponse<boolean>>;
  privateKey?: string;
  publicKey?: string;
  iv?: string;
  hashedPassword?: string;
  isGeneratingKeys: boolean;
} => {
  const [privateKey, setPrivateKey] = useState<string>();
  const [publicKey, setPublicKey] = useState<string>();
  const [iv, setIv] = useState<string>();
  const [hashedPassword, setHashedPassword] = useState<string>();

  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);

  const initialValues: SignupType = {
    email: undefined,
    name: undefined,
    password: undefined,
    confirmPassword: undefined,
    turnstileToken: undefined,
  };

  const generateKeys = async (password?: string): Promise<void> => {
    if (!password) return;
    setIsGeneratingKeys(true);
    const { publicKey, privateKey } = await crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      ['encrypt', 'decrypt'],
    );

    // Iv for encryption of the private key
    const ivBuffer = window.crypto.getRandomValues(new Uint8Array(12));

    // Hash Password
    const hashedPassword = await hash(password, ivBuffer);

    const wrappingKey = await generateWrappingKey(hashedPassword);

    // Encrypt the private key for storage in the database
    const encryptedPrivateKey = await window.crypto.subtle.wrapKey('pkcs8', privateKey, wrappingKey, {
      name: 'AES-GCM',
      iv: ivBuffer,
    });

    // Stringify the keys and iv so they can be send via JSON
    const publicKeyString = await stringifyKey('spki', publicKey);
    const privateKeyString = arrayBufferToBase64(encryptedPrivateKey);
    const ivString = uint8ToBase64(ivBuffer);
    const hashedPasswordString = arrayBufferToBase64(hashedPassword);

    setPrivateKey(privateKeyString);
    setPublicKey(publicKeyString);
    setIv(ivString);
    setHashedPassword(hashedPasswordString);
    setIsGeneratingKeys(false);
  };

  const signup = async (
    turnstileToken: string,
    email?: string,
    name?: string,
    password?: string,
  ): Promise<RequestResponse<SignupResponse>> => {
    const res = await clientRequest<APIOperation.SIGNUP>({
      op: APIOperation.SIGNUP,
      payload: { email, password, name, privateKey, publicKey, iv, turnstileToken },
    });
    return res;
  };

  const checkIfUserExists = async (email?: string): Promise<RequestResponse<boolean>> => {
    const res = await clientRequest<APIOperation.CHECK_IF_USER_EXISTS>({
      op: APIOperation.CHECK_IF_USER_EXISTS,
      params: { email },
    });
    return res;
  };

  return { initialValues, generateKeys, signup, checkIfUserExists, isGeneratingKeys, hashedPassword };
};

export default useSignup;
