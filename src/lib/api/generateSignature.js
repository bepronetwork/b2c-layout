import Web3 from "web3";
import Account from "./account";
import CryptographySingleton from "./Cryptography";

const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default function generateSignature() {
  return {
    signature: {
      v: "0x1c",
      r: "0x33c3a35f8e579224c25ce4436a5b519b5f78e01e4714e50606dd54a02bcffd58",
      s: "0x1d5230d5f07b4c553ccf39a607e27fc3e1c9a94020de33354c4163681a6cb362"
    },
    nonce: getRandom(100, 50000000)
  };

  const web3 = new Web3(
    new Web3.providers.HttpProvider("https://rinkeby.infura.io/")
  );

  const privateKey = CryptographySingleton.generatePrivateKey();

  const params = {
    clientAccount: new Account(
      web3,
      web3.eth.accounts.privateKeyToAccount(privateKey)
    ),
    nonce: getRandom(100, 50000000),
    category: 1, // Bet,
    web3
  };

  return CryptographySingleton.getUserSignature(params);
}
