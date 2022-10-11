const X25519DH = require('./X25519DH');
const AESGCMCipher = require('./AESGCMCipher');
const CipherState = require('./CipherState');
const SHA256Hash = require('./SHA256Hash');
const WASymmetricState = require('./WASymmetricState');
const HandshakeState = require('./HandshakeState');
const SwitchableHandshakeState = require('./SwitchableHandshakeState');

class HandShake {
  constructor(waSocketClient) {
    this.waSocketClient = waSocketClient;

    const versionMajor = 5;
    const versionMinor = 2;
    const waversion = Buffer.from([versionMajor, versionMinor]);

    this.HEADER = Buffer.concat([Buffer.from('WA'), waversion]);
    this._prologue = Buffer.concat([Buffer.from('WA'), waversion]);

    this.EDGE_HEADER = Buffer.concat([Buffer.from('ED'), Buffer.from([0, 1])]);
  }

  async login() {
    const dh = new X25519DH();
    const cipher = new AESGCMCipher();

    const waSymmetricState = new WASymmetricState(new CipherState(cipher), new SHA256Hash());
    const handshakeState = new SwitchableHandshakeState(new HandshakeState(waSymmetricState, dh));
  }
}

module.exports = HandShake;
