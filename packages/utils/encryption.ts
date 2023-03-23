import CryptoJS from "crypto-js";

export const encrypt = (value: string, key: string) => {
    return CryptoJS.AES.encrypt(value, key).toString();
}
  
export const decrypt = (ciphertext: string, key: string) => {
    const bytes  = CryptoJS.AES.decrypt(ciphertext, key);
    const base64string =  bytes.toString(CryptoJS.enc.Utf8);
    const value = atob(base64string);
    return value.split(":")[2];
}

export const generateEncryptionKey = (projectId: string, userId: string) => {
    return btoa(`${projectId}:${userId}:${process.env.ENCRYPTION_KEY}`)
}