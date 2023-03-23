import CryptoJS from "crypto-js";

export const encrypt = (value: string, key: string) => {
    return CryptoJS.AES.encrypt(value, key).toString();
}
  
export const decrypt = (ciphertext: string, key: string) => {
    const bytes  = CryptoJS.AES.decrypt(ciphertext, key);
    return bytes.toString(CryptoJS.enc.Utf8);
}

export const generateEncryptionKey = (projectId: string, userId: string) => {
    return btoa(`${projectId}:${userId}:${process.env.ENCRYPTION_KEY}`)
}