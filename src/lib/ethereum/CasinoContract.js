import { casino } from "./interfaces";

import Contract from "./models/Contract";
import ERC20TokenContract from "./ERC20TokenContract";
import { Numbers } from "./lib";

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
		let amountWithDecimals = Numbers.toSmartContractDecimals(
            amount,
            self.decimals
        );
        
        return new Promise ( (resolve, reject) => {
            self.contract.getContract().methods.withdraw(amountWithDecimals)
            .send({ from: address })   
            .on('transactionHash', (hash) => {
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
                self.contract.getContract().methods.deposit(address, amountWithDecimals, nonce)
                .send({ from: address })
                .on('transactionHash', (hash) => {
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
    
    async getApprovedWithdrawAmount(address){
        try{
            return Numbers.fromBigNumberToInteger(await self.contract.getContract().methods.approveWithdraw(address).call())
        }catch(err){
            throw err;
        }
    }

    async cancelWithdraw({address}){
        try{
            var res;
            let approvedWithdrawAmount = await this.getApprovedWithdrawAmount(address);
            if(approvedWithdrawAmount > 0){
                return new Promise ( (resolve, reject) => {
                    self.contract.getContract().methods.cancelWithdraw().send({from : address})
                    .on('transactionHash', (hash) => {
                    })
                    .on('confirmation', (confirmations, receipt) => {
                        resolve(receipt)
                    })
                    .on('error', () => {reject("Transaction Error")})
                });
            }
            return res;
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

	async determinePlayer(signedMessageObject, winBalance, nonce, category) {
		let accounts = await window.web3.eth.getAccounts();

		try {
		let response = await self.contract
			.getContract()
			.methods.determinePlayer(
			parseInt(winBalance),
			nonce,
			category,
			signedMessageObject.v,
			signedMessageObject.r,
			signedMessageObject.s
			)
			.call({
			from: accounts[0]
			});
		return response;
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
			.methods.playerBalance()
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
