import Web3 from "web3";

const NONCE_MIN = 1346;
const NONCE_MAX = 45374598679192; 

enableMetamask('eth');
runMetamaskListener();
async function enableMetamask(currency) {
   const { ethereum } = window;
        
    switch (currency) {
        case "eth": {
            if(ethereum)
                await ethereum.enable();
        }
        default: {
            break;
        }
    }
}

var metamaskAddress = null;


function addressConcat(string=''){
    return  `${string.substring(0, 6)}...${string.substring(string.length - 2)}`;
}

async function promptMetamask(){
    let address = await getMetamaskAccount();
    if(!address){throw new Error("Please Open or Install Metamask")}
}

async function getMetamaskAccount() {
    try{
        if(!metamaskAddress){
            window.web3 = new Web3(window.ethereum);
            const accounts = await window.web3.eth.getAccounts();
            metamaskAddress = accounts[0];
        }
    }catch(err){
        // NO Metamask
    }
    return metamaskAddress;
}

function getNonce() {
  return Math.floor(Math.random() * (NONCE_MAX - NONCE_MIN + 1)) + NONCE_MIN;
}

function runMetamaskListener(){
    if(window.ethereum){
        window.ethereum.on('accountsChanged', (accounts) => {
            // Time to reload your interface with accounts[0]!
            metamaskAddress = accounts[0];
        })
        
        window.ethereum.on('networkChanged', (netId) =>  {
            console.log(netId);
        })
}  
}

export { enableMetamask, getMetamaskAccount, getNonce, addressConcat, promptMetamask };
