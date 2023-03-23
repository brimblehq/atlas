import CryptoJS from "crypto-js";

export const encrypt = (value: string, key: string) => {
    return CryptoJS.AES.encrypt(value, key).toString();
}
  
export const decrypt = (ciphertext: string, key: string) => {
    const bytes  = CryptoJS.AES.decrypt(ciphertext, key);
    const base64string =  bytes.toString(CryptoJS.enc.Utf8);
    const value = Buffer.from(base64string, 'base64').toString('utf8');
    return value.split(":")[2];
}

export const generateEncryptionKey = (projectId: string, userId: string, key: string) => {
    return Buffer.from(`${projectId}:${userId}:${key}`, 'binary').toString('base64');
}