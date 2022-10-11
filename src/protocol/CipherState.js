const crypto = require('./crypto');

class CipherState {
  constructor(name) {
    // aes 加解密的 key 字段
    this._key = Buffer.alloc(0);
    this._nonce = 0;
    this.name = name;
  }

  initialize_key(key) {
    this._key = key;
    this.set_nonce(0);
  }

  set_nonce(nonce) {
    this._nonce = nonce;
  }

  has_key() {
    return this._key && this._key.length;
  }

  rekey() {
    const key = crypto.encryptAES256GCM(
      Buffer.alloc(32).fill(0),
      this._key,
      Buffer.alloc(0),
      2 ** 64 - 1
    );
    this.initialize_key(key);
  }

  encrypt_with_ad(ad, plaintext) {
    if (!this._key.length) return plaintext;
    const result = crypto.encryptAES256GCM(plaintext, this._key, ad, this._nonce);
    this._nonce += 1;
    return result;
  }

  decrypt_with_ad(ad, ciphertext) {
    if (!this._key.length) return ciphertext;
    const result = crypto.decryptAES256GCM(ciphertext, this._key, ad, this._nonce);
    this._nonce += 1;
    return result;
  }
}

module.exports = CipherState;
