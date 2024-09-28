'use client';
import { useState } from 'react';
import { APIOperation } from '../services/api-services/common';
import { RequestResponse } from '../types/request-response.type';
import { SignupResponse } from '../types/response.types';
import { SignupType } from '../types/signup.type';
import { clientRequest } from '../services/api-services/requests/client-side';

const useSignup = (): {
  initialValues: SignupType;
  generateKeys: (password?: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<RequestResponse<SignupResponse>>;
  checkIfUserExists: (email: string) => Promise<RequestResponse<boolean>>;
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
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
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

    const hashedPassword = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));

    const wrapingKey = await window.crypto.subtle.importKey('raw', hashedPassword, { name: 'AES-GCM' }, false, [
      'wrapKey',
      'unwrapKey',
    ]);

    const ivBuffer = window.crypto.getRandomValues(new Uint8Array(12));

    const encryptedPrivateKey = await window.crypto.subtle.wrapKey('pkcs8', privateKey, wrapingKey, {
      name: 'AES-GCM',
      iv: ivBuffer,
    });

    // Stringify the keys and iv so they can be send via JSON
    const publicKeySPKI = await window.crypto.subtle.exportKey('spki', publicKey);
    const publicKeyString = Buffer.from(publicKeySPKI).toString('base64');
    const privateKeyString = Buffer.from(encryptedPrivateKey).toString('base64');
    const ivString = Buffer.from(ivBuffer).toString('base64');
    const hashedPasswordString = Buffer.from(hashedPassword).toString('base64');

    setPrivateKey(privateKeyString);
    setPublicKey(publicKeyString);
    setIv(ivString);
    setHashedPassword(hashedPasswordString);
    setIsGeneratingKeys(false);
  };

  const signup = async (email: string, name: string, password: string): Promise<RequestResponse<SignupResponse>> => {
    const res = await clientRequest<APIOperation.SIGNUP>({
      op: APIOperation.SIGNUP,
      payload: { email, password, name, privateKey, publicKey, iv },
    });
    return res;
  };

  const checkIfUserExists = async (email: string): Promise<RequestResponse<boolean>> => {
    const res = await clientRequest<APIOperation.CHECK_IF_USER_EXISTS>({
      op: APIOperation.CHECK_IF_USER_EXISTS,
      params: { email },
    });
    return res;
  };

  return { initialValues, generateKeys, signup, checkIfUserExists, isGeneratingKeys, hashedPassword };
};

export default useSignup;
