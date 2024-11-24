'use client';
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

async function generateWrappingKey(hashedPassword: ArrayBuffer): Promise<CryptoKey> {
  // Generate a wraping key out of the hashed password for encrypting the private key
  const wrappingKey = await window.crypto.subtle.importKey('raw', hashedPassword, { name: 'AES-GCM' }, true, [
    'wrapKey',
    'unwrapKey',
  ]);
  return wrappingKey;
}

async function stringifyKey(format: 'raw' | 'pkcs8' | 'spki', key: CryptoKey): Promise<string> {
  const keyBuffer = await window.crypto.subtle.exportKey(format, key);
  return arrayBufferToBase64(keyBuffer);
}

export {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  base64ToUint8,
  generateWrappingKey,
  hash,
  stringifyKey,
  uint8ToBase64,
};
