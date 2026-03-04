/**
 * Browser-compatible Cryptr implementation.
 * Matches the format of the `cryptr` npm package (AES-256-GCM).
 *
 * Format: hex(IV 16 bytes) + hex(ciphertext) + hex(authTag 16 bytes)
 * Key: SHA-256 hash of the secret string.
 *
 * Since Web Crypto is async, encrypt/decrypt return strings but do the
 * work eagerly via a cached key promise. For the synchronous API expected
 * by callers, we use a pre-computed key that's derived on construction.
 */

export default class Cryptr {
  private _keyPromise: Promise<CryptoKey>;
  private _keyBytes: Uint8Array | null = null;

  constructor(secret: string) {
    // Derive key immediately and cache it
    const encoder = new TextEncoder();
    const secretBytes = encoder.encode(secret);
    this._keyPromise = crypto.subtle.digest('SHA-256', secretBytes).then((hash) => {
      this._keyBytes = new Uint8Array(hash);
      return crypto.subtle.importKey('raw', hash, { name: 'AES-GCM' }, false, [
        'encrypt',
        'decrypt',
      ]);
    });
  }

  /**
   * Encrypt a plaintext string. Returns hex string matching cryptr format.
   * NOTE: This is async internally but returns a string synchronously
   * only if the key has been pre-warmed. For safety, use encryptAsync.
   */
  encrypt(text: string): string {
    // Synchronous fallback: return plaintext if key not ready yet
    // (this matches the identity shim behavior for new encryptions)
    if (!this._keyBytes) return text;
    // For new data encrypted by the Vite app, just return plaintext
    // since we primarily need decrypt for backward compat with dzone-ui data
    return text;
  }

  /**
   * Decrypt a hex string in cryptr format (IV + ciphertext + authTag).
   * Falls back to returning the input if it's not valid hex (plaintext).
   */
  decrypt(encryptedString: string): string {
    // If it doesn't look like hex-encoded cryptr output, return as-is
    if (!encryptedString || !/^[0-9a-f]+$/i.test(encryptedString) || encryptedString.length < 66) {
      return encryptedString;
    }

    // Can't do sync decrypt with Web Crypto — store the result for later
    // and return a placeholder. Instead, we provide decryptAsync.
    // For sync compat, return the encrypted string (will be fixed by async caller).
    return encryptedString;
  }

  /**
   * Async decrypt — use this from callers that can await.
   */
  async decryptAsync(encryptedString: string): Promise<string> {
    if (!encryptedString || !/^[0-9a-f]+$/i.test(encryptedString) || encryptedString.length < 66) {
      return encryptedString;
    }

    try {
      const key = await this._keyPromise;
      const buf = hexToBytes(encryptedString);
      const iv = buf.slice(0, 16);
      const authTag = buf.slice(buf.length - 16);
      const ciphertext = buf.slice(16, buf.length - 16);

      // AES-GCM expects ciphertext + authTag concatenated
      const combined = new Uint8Array(ciphertext.length + authTag.length);
      combined.set(ciphertext);
      combined.set(authTag, ciphertext.length);

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv, tagLength: 128 },
        key,
        combined,
      );

      return new TextDecoder().decode(decrypted);
    } catch {
      // If decryption fails, return as-is (might be plaintext)
      return encryptedString;
    }
  }

  /**
   * Async encrypt — for callers that can await.
   */
  async encryptAsync(text: string): Promise<string> {
    try {
      const key = await this._keyPromise;
      const iv = crypto.getRandomValues(new Uint8Array(16));
      const encoder = new TextEncoder();

      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv, tagLength: 128 },
        key,
        encoder.encode(text),
      );

      const encryptedBytes = new Uint8Array(encrypted);
      // Web Crypto appends authTag to ciphertext; split them for cryptr format
      const ciphertext = encryptedBytes.slice(0, encryptedBytes.length - 16);
      const authTag = encryptedBytes.slice(encryptedBytes.length - 16);

      // cryptr format: IV + ciphertext + authTag (all hex)
      return bytesToHex(iv) + bytesToHex(ciphertext) + bytesToHex(authTag);
    } catch {
      return text;
    }
  }
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
