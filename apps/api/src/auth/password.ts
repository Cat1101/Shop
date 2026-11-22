import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

const options = { N: 32_768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 };
const dummyHash = `${'0'.repeat(32)}:${'0'.repeat(128)}`;

function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, options, (error, key) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(key);
    });
  });
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await deriveKey(password, salt);
  return `${salt.toString('hex')}:${key.toString('hex')}`;
}

export async function verifyPassword(password: string, storedHash: string | undefined) {
  const [salt, expectedKey] = (storedHash ?? dummyHash).split(':');
  const key = await deriveKey(password, Buffer.from(salt, 'hex'));
  return timingSafeEqual(key, Buffer.from(expectedKey, 'hex')) && storedHash !== undefined;
}
