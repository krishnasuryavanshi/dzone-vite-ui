import Cryptr from './cryptr';

const SecretKey = `${import.meta.env.VITE_SECRET_KEY ?? import.meta.env.VITE_SECRET_KEY}`;

const cryptrInstance = new Cryptr(SecretKey);

export function encrypt(text: string) {
  return cryptrInstance.encrypt(text);
}

export function decrypt(encryptedString: string) {
  return cryptrInstance.decrypt(encryptedString);
}

/** Async decrypt — properly decrypts AES-256-GCM from the original dzone-ui app */
export async function decryptAsync(encryptedString: string) {
  return cryptrInstance.decryptAsync(encryptedString);
}

/** Async encrypt — properly encrypts with AES-256-GCM */
export async function encryptAsync(text: string) {
  return cryptrInstance.encryptAsync(text);
}
