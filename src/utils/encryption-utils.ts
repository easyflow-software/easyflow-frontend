'use client';
async function generateAsymetricKeys(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt'],
  );
}

async function generateSymetricKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
}

function getRandomValues(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(12));
}

async function wrapKey(
  key: CryptoKey,
  wrapingKey: CryptoKey,
  ivBuffer: Uint8Array<ArrayBufferLike>,
): Promise<ArrayBuffer> {
  return crypto.subtle.wrapKey('pkcs8', key, wrapingKey, {
    name: 'AES-GCM',
    iv: ivBuffer,
  });
}

function uint8ToBase64(bytes: Uint8Array): string {
  // Use a more direct approach using typed arrays
  return btoa(
    Array.from(bytes)
      .map(byte => String.fromCharCode(byte))
      .join(''),
  );
}

function base64ToUint8(base64: string): Uint8Array {
  const binaryString = atob(base64);
  return new Uint8Array(binaryString.split('').map(char => char.charCodeAt(0)));
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return uint8ToBase64(bytes);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const uint8Array = base64ToUint8(base64);
  // Create a new ArrayBuffer with the same length and copy the data
  const arrayBuffer = new ArrayBuffer(uint8Array.length);
  new Uint8Array(arrayBuffer).set(uint8Array);
  return arrayBuffer;
}

async function hash(password: string, salt: Uint8Array): Promise<ArrayBuffer> {
  // Convert password string to bytes
  const passwordBuffer = new TextEncoder().encode(password);

  // Import the password as a raw key for PBKDF2
  const baseKey = await crypto.subtle.importKey('raw', passwordBuffer, { name: 'PBKDF2' }, true, [
    'deriveBits',
    'deriveKey',
  ]);

  // Derive a 256-bit key from the password using PBKDF2
  const hashedPassword = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    baseKey,
    256,
  );

  return hashedPassword;
}

async function generateWrapingKey(hashedPassword: ArrayBuffer): Promise<CryptoKey> {
  // Generate a wraping key out of the hashed password for encrypting the private key
  return crypto.subtle.importKey('raw', hashedPassword, { name: 'AES-GCM' }, true, ['wrapKey', 'unwrapKey']);
}

async function stringifyKey(format: 'raw' | 'pkcs8' | 'spki', key: CryptoKey): Promise<string> {
  const keyBuffer = await crypto.subtle.exportKey(format, key);
  return arrayBufferToBase64(keyBuffer);
}

async function retrivePublicKey(publicKey: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('spki', base64ToArrayBuffer(publicKey), { name: 'RSA-OAEP', hash: 'SHA-256' }, false, [
    'encrypt',
  ]);
}

async function retrivePrivateKey(
  privateKey: string,
  key: CryptoKey,
  ivBuffer: Uint8Array<ArrayBufferLike>,
): Promise<CryptoKey> {
  return crypto.subtle.unwrapKey(
    'pkcs8',
    base64ToArrayBuffer(privateKey),
    key,
    { name: 'AES-GCM', iv: ivBuffer },
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['decrypt'],
  );
}

async function retriveWrapingKey(
  wrapingKey: string,
  key: CryptoKey,
  ivBuffer: Uint8Array<ArrayBufferLike>,
): Promise<CryptoKey> {
  return crypto.subtle.unwrapKey(
    'raw',
    base64ToArrayBuffer(wrapingKey),
    key,
    { name: 'AES-GCM', iv: ivBuffer },
    { name: 'AES-GCM', length: 256 },
    false,
    ['wrapKey', 'unwrapKey'],
  );
}

export {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  base64ToUint8,
  generateAsymetricKeys,
  generateSymetricKey,
  generateWrapingKey,
  getRandomValues,
  hash,
  retrivePrivateKey,
  retrivePublicKey,
  retriveWrapingKey,
  stringifyKey,
  uint8ToBase64,
  wrapKey,
};
