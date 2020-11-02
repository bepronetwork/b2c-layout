import SHA512 from "crypto-js/hmac-sha512";

class Cryptography {
  generateNonce() {
    return Math.floor(Math.random() * 10000000000000000) + 1;
  }

  generateRandomResult(serverSeed, clientSeed) {
    return SHA512(serverSeed, clientSeed);
  }
}

const CryptographySingleton = new Cryptography();

export default CryptographySingleton;
