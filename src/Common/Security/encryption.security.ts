import * as CryptoJS from 'crypto-js';

export const encrypt = (plainText: string, secret: string): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(plainText), secret).toString();
};

export const decrypt = (cipherText: string, secret: string): string => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secret);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
