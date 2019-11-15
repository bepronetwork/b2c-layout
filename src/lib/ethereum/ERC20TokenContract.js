import { ierc20 } from "./interfaces";

import Contract from "./models/Contract";
import { Numbers } from "./lib";
import { getTransactionOptions } from "./lib/Ethereum";

let self;

class ERC20TokenContract {
    constructor(params) {        
        self = {
        contract: new Contract({
            web3: window.web3,
            contract: ierc20,
            address: params.contractAddress
        }),
        ...params
        };
    }

    getContract() {
        return self.contract.getContract();
    }

    getAddress() {
        return self.contract.getAddress();
    }

    async getTokenAmount(address) {
        if(!address){return 0}
        return await self.contract.getContract().methods.balanceOf(address).call();
    }

    async getAllowedAmount(address, spender){
        try{
            return await self.contract.getContract().methods.allowance(address, spender).call();
        }catch(err){
            throw err;
        }
    }

    async allowDepositToContract({address, platformAddress, amount, decimals}) {
        try {
            let opt = await getTransactionOptions('fast')

            let amountWithDecimals = Numbers.toSmartContractDecimals(amount, decimals);

            return new Promise ( (resolve, reject) => {
                self.contract.getContract().methods.approve(platformAddress, amountWithDecimals)
                .send({ from: address, gasPrice : opt.gasPrice.toString(), gas : opt.gas})
                .on('confirmation', (confirmations, receipt) => {
                    if(confirmations > 1){
                        resolve(receipt)
                    }
                })
                .on('error', (err) => {console.log(err); reject("Transaction Error")})
            });
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async sendTokens({address, to, amount, decimals }) {
        let opt = await getTransactionOptions('fast')

        let amountWithDecimals = Numbers.toSmartContractDecimals(amount, decimals);

        return new Promise ( (resolve, reject) => {
            self.contract.getContract().methods.transfer(to, amountWithDecimals)
            .send({ from: address, gasPrice : opt.gasPrice.toString(), gas : opt.gas})
            .on('confirmation', (confirmations, receipt) => {
                if(confirmations > 1){
                    resolve(receipt)
                }
            })
            .on('error', (err) => {console.log(err); reject("Transaction Error")})
        });

    }

    getABI() {
        return self.contract;
    }
}


export default ERC20TokenContract;
