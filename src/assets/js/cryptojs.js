import CryptoJS from "crypto-js";

// ECB模式
export default {
  // 加密
  encrypt(word, keyStr) {
    // word, keyStr第一个参数是加密的字段名字  第二个是key值（16位）
    keyStr = keyStr || "az0XyMZ#aZaBHGxe&m8tng2WE2Dm#!C#"; // 密文（密钥）
    var key = CryptoJS.enc.Utf8.parse(keyStr);
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  },
  // 解密
  decrypt(word, keyStr) {
    keyStr = keyStr || "az0XyMZ#aZaBHGxe&m8tng2WE2Dm#!C#";
    var key = CryptoJS.enc.Utf8.parse(keyStr); // Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    var decrypt = CryptoJS.AES.decrypt(word, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  },
};
