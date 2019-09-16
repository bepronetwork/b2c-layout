import ERC20TokenContract from "../ERC20TokenContract";
import { getMetamaskAccount } from "../../metamask";
import { Numbers } from ".";

const FAST_GAS_PRICE_MULTIPLIER = 1.3;

export function getERC20Contract({tokenAddress}){
    return new ERC20TokenContract({
        web3: window.web3,
        contractAddress: tokenAddress
    });
}


export async function getERC20TokenAmount({tokenAddress}){
    let erc20 = getERC20Contract({tokenAddress});
    let addr = await getMetamaskAccount();
    return await Numbers.fromDecimals(await erc20.getTokenAmount(addr), 18);
}
export async function getETHBalance({address}){
    if(!address){return 0}
    let wei = await window.web3.eth.getBalance(address);
    return window.web3.utils.fromWei(wei, 'ether')
}

export async function getTransactionOptions(velocity){

    let medianGasPrice = await window.web3.eth.getGasPrice();
    let gasPrice;

    switch(velocity){
        case 'fast' : {
            gasPrice = new String(parseInt(medianGasPrice)*FAST_GAS_PRICE_MULTIPLIER); 
            break;
        };
    }
    let options = {
        gasPrice,
        shouldValidate: true,
    };

    return options;
};
