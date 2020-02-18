import SHA512 from "crypto-js/hmac-sha512";
import SHA512_HASH from "crypto-js/sha512";
import randomstring from "randomstring";
import randomHex from "randomhex";
import { Numbers } from "../ethereum/lib";

class Cryptography {
    generateSeed(length = 32) {
        return randomHex(length);
    }

    hashSeed(seed) {
        return SHA512_HASH(seed);
    }

    generateNonce() {
        return Math.floor(Math.random() * 10000000000000000) + 1;
    }

    generateRandomResult(serverSeed, clientSeed) {
        return SHA512(serverSeed, clientSeed);
    }

}

const CryptographySingleton = new Cryptography();

export default CryptographySingleton;
