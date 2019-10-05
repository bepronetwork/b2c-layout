import { casino } from "./interfaces";

import Contract from "./models/Contract";
import ERC20TokenContract from "./ERC20TokenContract";
import { Numbers } from "./lib";
import { getTransactionOptions } from "./lib/Ethereum";

let self;

class CasinoContract {
	constructor({ contractAddress, tokenAddress, decimals }) {
        this.decimals = decimals;
		self = {
		contract: new Contract({
			web3: window.web3,
			contract: casino,
			address: contractAddress,
			tokenAddress: tokenAddress
		}),
		erc20TokenContract: new ERC20TokenContract({
			web3: window.web3,
			contractAddress: tokenAddress
		}),
		decimals: decimals
		};
	}

	async withdrawTokens({ address, amount }) {
        
        let timestampWithdraw = await this.getTimeForWithdrawal(address);
        if(timestampWithdraw > 0){throw new Error("Time for Withdraw hans´t passed")}
        let opt = await getTransactionOptions('fast')

		let amountWithDecimals = Numbers.toSmartContractDecimals(
            amount,
            self.decimals
        );

        return new Promise ( (resolve, reject) => {
            self.contract.getContract().methods.withdraw(amountWithDecimals)
            .send({ from: address, gasPrice : new String(opt.gasPrice).toString(), gas : opt.gas })   
            .on('confirmation', (confirmations, receipt) => {
                console.log(confirmations)
                if(confirmations > 1){
                    resolve(receipt)
                }
            })
            .on('error', () => {reject("Transaction Error")})
        });
    }

    async getWithdrawalTimeLimit(){
        

        return await self.contract.getContract().methods.releaseTime().call();
    }

    async isPaused(){
        

        return await self.contract.getContract().methods.paused().call();
    }


    async getTimeForWithdrawal(address){
        try{
            let withdrawal = await self.contract.getContract().methods.withdrawals(address).call();
            if(!withdrawal){return 0};
            let timeNeeded = (parseInt(await this.getWithdrawalTimeLimit()) + parseInt(withdrawal.timestamp) - (Date.now()/1000));
            return parseInt(timeNeeded);
        }catch(err){
            return 0;
        }
    }

    async getMaxWithdrawal(){
        return Numbers.fromDecimals(await self.contract.getContract().methods.maxWithdrawal().call(), this.decimals);
	}

    async getMaxDeposit(){
        return Numbers.fromDecimals( await self.contract.getContract().methods.maxDeposit().call(), this.decimals);
    }

    async getWithdrawalTimeRelease(){
        

        return Numbers.fromSmartContractTimeToSeconds(await self.contract.getContract().methods.releaseTime().call());
    }

    async getAllowedDepositAmountForApp(address){
        

        try{
            let amount = await self.erc20TokenContract.getAllowedAmount(
                address, self.contract.getAddress()
            );
            return parseInt(amount);
        }catch(err){
            return 0;
        }
    }
    
    async getApprovedWithdrawAmount(address){
        

        try{
            let res = await self.contract.getContract().methods.withdrawals(address).call();
            return Numbers.fromBigNumberToInteger(res ? res.amount : 0);
        }catch(err){
            throw err;
        }
    }

    async getApprovedWithdrawTimeStamp(address){
        

        try{
            let res = await self.contract.getContract().methods.withdrawals(address).call();
            return Numbers.fromBigNumberToInteger(res ? res.timestamp : {timestamp : 0});
               
        }catch(err){
            throw err;
        }
    }
 
	async allowDepositToContract({ address, amount }) {
		try {
            await self.erc20TokenContract.allowDepositToContract({
                address,
                amount,
                decimals: self.decimals,
                platformAddress: self.contract.getAddress()
            });
            return true;
		} catch (err) {
		    throw err;
		}
	}


	async depositTokens({address, amount}) {
		try {
            let opt = await getTransactionOptions('fast')

            let amountWithDecimals = Numbers.toSmartContractDecimals(
                amount,
                self.decimals
            );
            return new Promise ( (resolve, reject) => {
                self.contract.getContract().methods.deposit(amountWithDecimals)
                .send({ from: address, gasPrice : new String(opt.gasPrice).toString(), gas : opt.gas })
                .on('confirmation', (confirmations, receipt) => {
                    if(confirmations > 1){
                        resolve(receipt)
                    }
                })
                .on('error', () => {reject("Transaction Error")})
            });
        }catch(err){
            throw err;
        }
    }

	async getBankRoll() {
        

		try {
		let res = await self.contract
			.getContract()
			.methods.bankroll()
			.call();
		let number = window.web3.utils.hexToNumber(res._hex);
		return Numbers.fromBigNumberToInteger(number);
		} catch (err) {
		throw err;
		}
	}

	fromIntToFloatEthereum(int) {
        

		return Math.round(int * 100);
	}

	async getHouseTokenAmount() {
        

		try {
		let playersTokenAmount = await this.getAllPlayersTokenAmount();
		let houseAmount = await this.getSmartContractLiquidity();
		return houseAmount - playersTokenAmount;
		} catch (err) {
		return "N/A";
		}
	}

	async getAllPlayersTokenAmount() {
        

		try {
		return Numbers.fromBigNumberToInteger(
			await self.contract
			.getContract()
			.methods.totalPlayerBalance()
			.call()
		);
		} catch (err) {
		return "N/A";
		}
	}

	async getSmartContractLiquidity() {
        

		try {
		return Numbers.fromBigNumberToInteger(
			await self.erc20TokenContract.getTokenAmount(this.getAddress())
		);
		} catch (err) {
		return "N/A";
		}
    }
    
    

	getAddress() {
		return self.contract.getAddress();
    }
    
    getERC20Token(){
        return self.erc20TokenContract;
    }

}

export default CasinoContract;
