import ERC20TokenContract from "../ERC20TokenContract";
import { getMetamaskAccount } from "../../metamask";
import { Numbers } from ".";
import { GAS_MULTIPLIER, GAS_AMOUNT } from "../../api/apiConfig";

const FAST_GAS_PRICE_MULTIPLIER = GAS_MULTIPLIER;

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
    let gasPrice, gasAmount;

    switch(velocity){
        case 'fast' : {
            gasPrice = new String(parseInt(medianGasPrice)*FAST_GAS_PRICE_MULTIPLIER);
            gasAmount = GAS_AMOUNT; 
            break;
        };
        case 'medium' : {
            gasPrice = new String(parseInt(medianGasPrice)*1.3);
            gasAmount = GAS_AMOUNT; 
            break;
        };
    }
    let options = {
        gasPrice,
        gas : gasAmount,
        shouldValidate: true,
    };

    return options;
};
