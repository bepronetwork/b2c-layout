import Web3 from "web3";

const NONCE_MIN = 1346;
const NONCE_MAX = 45374598679192;

async function enableMetamask(currency) {
    const { ethereum } = window;
        
    switch (currency) {
        case "eth": {
            if(ethereum)
                await ethereum.enable();
        break;
        }
        default: {
            break;
        }
    }
}

function addressConcat(string){
    return  `${string.substring(0, 6)}...${string.substring(string.length - 2)}`;
}


async function getMetamaksAccount() {
    window.web3 = new Web3(window.ethereum);
    const accounts = await window.web3.eth.getAccounts();

    return accounts[0];
}

function getNonce() {
  return Math.floor(Math.random() * (NONCE_MAX - NONCE_MIN + 1)) + NONCE_MIN;
}

export { enableMetamask, getMetamaksAccount, getNonce, addressConcat };
