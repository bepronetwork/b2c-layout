import { casino } from "./interfaces";

import Contract from "./models/Contract";
import ERC20TokenContract from "./ERC20TokenContract";
import { Numbers } from "./lib";
import { fromSmartContractTimeToMinutes } from "../helpers";

let self;

class CasinoContract {
	constructor({ contractAddress, tokenAddress, decimals }) {
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
        let timestampWithdraw = await this.getApprovedWithdrawTimeStamp(address);
        var timestamp = window.web3.eth.getBlock(window.web3.eth.blockNumber).timestamp;
        var limitTimestamp = await this.getWithdrawalTimeRelease();
        console.log(timestamp, timestampWithdraw, limitTimestamp);
        console.log(timestamp >= timestampWithdraw + limitTimestamp);

		let amountWithDecimals = Numbers.toSmartContractDecimals(
            amount,
            self.decimals
        );

        return new Promise ( (resolve, reject) => {
            self.contract.getContract().methods.withdraw(amountWithDecimals)
            .send({ from: address })   
            .on('transactionHash', (hash) => {
            })
            .on('receipt', (receipt) => {
                console.log(receipt)
                resolve(receipt)
            })
            .on('confirmation', (confirmations, receipt) => {
                resolve(receipt)
            })
            .on('error', () => {reject("Transaction Error")})
        });
	}

	async depositTokens({ address, amount, nonce}) {
		try {
            /* Allow Transfer from Smart-Contract */
            await this.allowWithdrawalFromContract({ address, amount });
            let amountWithDecimals = Numbers.toSmartContractDecimals(
                amount,
                self.decimals
            );

            return new Promise ( (resolve, reject) => {
                self.contract.getContract().methods.deposit(amountWithDecimals)
                .send({ from: address })
                .on('transactionHash', (hash) => {
                })
                .on('receipt', (receipt) => {
                    console.log(receipt)
                    resolve(receipt)
                })
                .on('confirmation', (confirmations, receipt) => {
                    resolve(receipt)
                })
                .on('error', () => {reject("Transaction Error")})
            });
        }catch(err){
            throw err;
        }
    }

    async getWithdrawalTimeLimit(){
        return await self.contract.getContract().methods.releaseTime().call();
    }

    async isPaused(){
        return await self.contract.getContract().methods.paused().call();
    }


    async getTimeForWithdrawal(address){
        let withdrawal = await self.contract.getContract().methods.withdrawals(address).call();
        if(!withdrawal){return 0};
        let timeNeeded = (parseInt(await this.getWithdrawalTimeLimit()) + parseInt(withdrawal.timestamp) - (Date.now()/1000));
        return parseInt(timeNeeded);
    }

    async getMaxWithdrawal(){
        return Numbers.fromBigNumberToInteger( await self.contract.getContract().methods.maxWithdrawal().call())
    }

    async getWithdrawalTimeRelease(){
        return Numbers.fromSmartContractTimeToSeconds(await self.contract.getContract().methods.releaseTime().call());
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
 
	async allowWithdrawalFromContract({ address, amount }) {
		try {
            await self.erc20TokenContract.allowWithdrawalFromContract({
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

	async depositFunds({ amount, nonce }) {
		try {
		await this.allowWithdrawalFromContract({ amount });
		let amountWithDecimals = Numbers.toSmartContractDecimals(
			amount,
			self.decimals
		);
		let data = self.contract
			.getContract()
			.methods.deposit(self.account.getAddress(), amountWithDecimals, nonce)
			.encodeABI();
		return await self.contract.send(self.account.getAccount(), data);
		} catch (err) {
		console.log(err);
		}
	}
}

export default CasinoContract;
