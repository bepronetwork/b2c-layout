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

    generatePrivateKey = () => {
        return `0x${randomstring.generate({
        charset: "hex",
        length: 64
        })}`;
    };

     

    async getUserSignature({address, winBalance, nonce, category, decimals}){

        var data =  window.web3.utils.soliditySha3(
            {type: 'int128', value : Numbers.fromExponential(Numbers.toSmartContractDecimals(winBalance, decimals))},
            {type: 'uint128', value: nonce},
            {type: 'uint8', value: category}
        );

        if (window.web3.utils.isHexStrict(data)) {
            data = window.web3.utils.hexToBytes(data);
        }

        var messageBuffer = Buffer.from(data);
        var preamble = "\x19Ethereum Signed Message:\n".concat(data.length);
        var preambleBuffer = Buffer.from(preamble);
        var ethMessage = Buffer.concat([preambleBuffer, messageBuffer]);
        var hash = window.web3.utils.keccak256(ethMessage);
        let signedMessage = await window.web3.eth.sign(hash, address);
        let signedMessageSplitted = signedMessage.split('x')[1];
        
        let signature = {
            r : "0x" + signedMessageSplitted.substring(0, 64), 
            s : "0x" + signedMessageSplitted.substring(64, 128),
            v : "0x" + signedMessageSplitted.substring(128, 130)
        }
        return {
            signature ,
            nonce,
            category,
            address
        };
    }
}

const CryptographySingleton = new Cryptography();

export default CryptographySingleton;
