import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const CRYPTO_SECRET = process.env.CRYPTO_SECRET;
if (!CRYPTO_SECRET || CRYPTO_SECRET.length !== 32) {
  throw new Error('CRYPTO_SECRET must be exactly 32 characters long');
}

const algorithm = 'aes-256-cbc';
const key = Buffer.from(CRYPTO_SECRET, 'utf8');

export async function encrypt(text: string): Promise<string> {
  const iv = randomBytes(16);
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export async function decrypt(encryptedData: string): Promise<string> {
  const parts = encryptedData.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  const decipher = createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
