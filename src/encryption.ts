import crypto from 'crypto';

const ALGORITHM = 'aes256';
const INIT_VECTOR = Buffer.alloc(16, 0);
const SALT = 'apilytics';
const SECRET_KEY = crypto.scryptSync(process.env.SECRET_KEY || '', SALT, 32);

export const encrypt = (message: string): string => {
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, INIT_VECTOR);
  return cipher.update(message, 'utf-8', 'hex') + cipher.final('hex');
};

export const decrypt = (encryptedData: string): string => {
  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, INIT_VECTOR);
  return decipher.update(encryptedData, 'hex', 'utf-8') + decipher.final('utf8');
};
