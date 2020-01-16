import {
    casinoETH
} from "./interfaces";

import Contract from "./models/Contract";
import { getETHBalance } from "./lib/Ethereum";
import { getMetamaskAccount } from "../metamask";
import { Numbers } from "./lib";

let self;

class CasinoContractETH{
    constructor({contractAddress,   authorizedAddress, ownerAddress, croupierAddress}){
        self = {
            contract : 
            new Contract({
                web3 : window.web3,
                contract : casinoETH, 
                address : contractAddress
            }),
            croupierAddress,
            authorizedAddress,
            ownerAddress
        }
    }

      /**
     * @constructor Starting Function
     */

    async __init__(){
        let contractDepolyed = await this.deploy();
        this.__assert(contractDepolyed);
        await this.authorizeCroupier({addr : self.croupierAddress});
        return this;
    }


    async authorizeAccountToManage({addr=self.ownerAddress}){
        try{
            let accounts = await window.web3.eth.getAccounts();
            return new Promise ( (resolve, reject) => {
                self.contract.getContract().methods.authorizeAccount(
                    addr                 
                ).send({from : accounts[0]})
                .on('transactionHash', (hash) => {
                })
                .on('confirmation', (confirmations, receipt) => {
                    resolve(receipt)
                })
                .on('error', () => {reject("Transaction Error")})
            })          
        }catch(err){
            console.log(err);
        }   
    }

    async unauthorizeAccountToManage({addr}){
        try{
            let accounts = await window.web3.eth.getAccounts();
            return new Promise ( (resolve, reject) => {
                self.contract.getContract().methods.unauthorizeAccount(
                    addr                 
                ).send({from : accounts[0]})
                .on('transactionHash', (hash) => {
                })
                .on('confirmation', (confirmations, receipt) => {
                    resolve(receipt)
                })
                .on('error', () => {reject("Transaction Error")})
            })          
        }catch(err){
            console.log(err);
        }   
    }

    async authorizeCroupier({addr=self.authorized}){
        try{
            let accounts = await window.web3.eth.getAccounts();
            return new Promise ( (resolve, reject) => {
                self.contract.getContract().methods.authorizeCroupier(
                    addr                 
                ).send({from : accounts[0]})
                .on('transactionHash', (hash) => {
                })
                .on('confirmation', (confirmations, receipt) => {
                    resolve(receipt)
                })
                .on('error', () => {reject("Transaction Error")})
            })          
        }catch(err){
            console.log(err);
        }   
    }




    __assert(){
        self.contract.use(
            casinoETH,
            self.contractAddress);
    }

    /**
     * @constructor Starting Function
     */

  
    sendTokens = async ({amount}) => {
        try{
            let accounts = await window.web3.eth.getAccounts();

            return new Promise ( (resolve, reject) => {
                window.web3.eth.sendTransaction(
                    {
                        from: accounts[0],
                        to: this.getAddress(),
                        value:  window.web3.eth.utils.toWei(new String(amount).toString())
                    }
                ).on('transactionHash', (hash) => {
                })
                .on('confirmation', (confirmations, receipt) => {
                    resolve(receipt)
                })
                .on('error', () => {reject("Transaction Error")})
            });
        }catch(err){
            console.log(err);
        }   
    }
    
    async start(){
       
    }

    async getApprovedWithdrawAmount(address){
        try{
            return this.fromWei((await self.contract.getContract().methods.withdrawals(address).call()).amount)
        }catch(err){
            throw err;
        }
    }


    async withdrawTokens({amount, decimals}){
        let amountWithDecimals = this.toWei(amount);
        let accounts = await window.web3.eth.getAccounts();

        return new Promise ( (resolve, reject) => {
            self.contract.getContract().methods.withdraw(
                amountWithDecimals
            ).send({from : accounts[0]})
            .on('transactionHash', (hash) => {
            })
            .on('confirmation', (confirmations, receipt) => {
                resolve(receipt)
            })
            .on('error', () => {reject("Transaction Error")})
        })
    }

    async setUserWithdrawal({address, amount}){
        try{
            let accounts = await window.web3.eth.getAccounts();
            let amountWithDecimals = this.toWei(amount);
            return new Promise ( (resolve, reject) => {
                self.contract.getContract().methods.setUserWithdrawal(
                    address,
                    amountWithDecimals
                ).send({from : accounts[0]})
                .on('transactionHash', (hash) => {
                })
                .on('confirmation', (confirmations, receipt) => {
                    resolve(receipt)
                })
                .on('error', () => {reject("Transaction Error")})
            })
        }catch(err){
            throw err;
        }
    }

    async setUserWithdrawalBatch({addresses, amounts}){
        try{
            let accounts = await window.web3.eth.getAccounts();
            let amountsWithDecimals = amounts.map( a => this.toWei(a))
            return new Promise ( (resolve, reject) => {
                self.contract.getContract().methods.setUserWithdrawalBatch(
                    addresses,
                    amountsWithDecimals
                ).send({from : accounts[0]})
                .on('transactionHash', (hash) => {
                })
                .on('confirmation', (confirmations, receipt) => {
                    resolve(receipt)
                })
                .on('error', () => {reject("Transaction Error")})
            })
        }catch(err){
            throw err;
        }
    }

    toWei = (amount) => {
        return window.web3.utils.toWei(new String(amount).toString());
    }

    async withdrawApp({amount}){
        try{
            let accounts = await window.web3.eth.getAccounts();
            let amountWithDecimals = this.toWei(amount);
            return new Promise ( (resolve, reject) => {
                self.contract.getContract().methods.ownerWithdrawalTokens(
                    accounts[0],
                    amountWithDecimals
                ).send({from : accounts[0]})
                .on('transactionHash', (hash) => {
                })
                .on('confirmation', (confirmations, receipt) => {
                    resolve(receipt)
                })
                .on('error', () => {reject("Transaction Error")})
            })
        }catch(err){
            throw err;
        }
    }

    async changeCasinoToken({address}){
        try{
            let accounts = await window.web3.eth.getAccounts();
            return new Promise ( (resolve, reject) => {
                self.contract.getContract().methods.changeSingleTokenContract(
                    address
                ).send({from : accounts[0]})
                .on('transactionHash', (hash) => {
                })
                .on('confirmation', (confirmations, receipt) => {
                    resolve(receipt)
                })
                .on('error', () => {reject("Transaction Error")})
            })
        }catch(err){
            throw err;
        }
    }

    async updateContract({newContractAddress}){
        try{
            let accounts = await window.web3.eth.getAccounts();
            return new Promise ( (resolve, reject) => {
                self.contract.getContract().methods.updateToNewContract(
                    newContractAddress
                ).send({from : accounts[0]})
                .on('transactionHash', (hash) => {
                })
                .on('confirmation', (confirmations, receipt) => {
                    resolve(receipt)
                })
                .on('error', () => {reject("Transaction Error")})
            })
        }catch(err){
            throw err;
        }
    }

    async getBankRoll(){
        try{
            return this.fromWei(await self.contract.getContract().methods.bankroll().call()); 
        }catch(err){
            throw err;
        }
    }

    fromIntToFloatEthereum(int){
        return Math.round(int*100);
    }

    async getBalance(){
        const address = await getMetamaskAccount();
        return await getETHBalance({address});
    }

    async getHouseTokenAmount(){
        try{
            let playersTokenAmount = await this.getAllPlayersTokenAmount();
            let houseAmount = await this.getSmartContractLiquidity();
            return houseAmount - playersTokenAmount;
        }catch(err){
            return 'N/A';
        }
    }

    async getAllPlayersTokenAmount(){
        try{
            return this.fromWei(await self.contract.getContract().methods.totalPlayerBalance().call());
        }catch(err){
            return 'N/A';
        }
    }

    async getSmartContractLiquidity(){
        try{
            return this.fromWei(await self.erc20TokenContract.getTokenAmount(this.getAddress()));
        }catch(err){
            return 'N/A';
        }
    }

    async getMaxDeposit(){
        try{
            return this.fromWei(await self.contract.getContract().methods.maxDeposit().call());
        }catch(err){
            return 'N/A';
        }
    }

    async getMaxWithdrawal(){
        try{
            return this.fromWei(await self.contract.getContract().methods.maxWithdrawal().call());
        }catch(err){
            return 'N/A';
        }
    }

    async isPaused(){
        try{
            return await self.contract.getContract().methods.paused().call();
        }catch(err){
            return 'N/A';
        }
    }

    async pauseContract(){
        try{
            let accounts = await window.web3.eth.getAccounts();
            return new Promise ( (resolve, reject) => {
                self.contract.getContract().methods.pause().send({from : accounts[0]})
                .on('confirmation', (confirmations, receipt) => {
                    resolve(receipt)
                })
                .on('error', () => {reject("Transaction Error")})
            })
        }catch(err){
            throw err;
        }
    }

    async unpauseContract(){
        try{
            let accounts = await window.web3.eth.getAccounts();
            return new Promise ( (resolve, reject) => {
                self.contract.getContract().methods.unpause().send({from : accounts[0]})
                .on('confirmation', (confirmations, receipt) => {
                    resolve(receipt)
                })
                .on('error', () => {reject("Transaction Error")})
            })
        }catch(err){
            throw err;
        }
    }

    async getWithdrawalTimeLimit(){
        try{
            return Numbers.fromSmartContractTimeToMinutes(await self.contract.getContract().methods.releaseTime().call());
        }catch(err){
            console.log(err)
            return 'N/A';
        }
    }

    async changeMaxDeposit({amount}){
        try{
            let accounts = await window.web3.eth.getAccounts();
            let amountWithDecimals = this.toWei(amount);
            return new Promise ( (resolve, reject) => {
                self.contract.getContract().methods.changeMaxDeposit(
                    amountWithDecimals
                ).send({from : accounts[0]})
                .on('transactionHash', (hash) => {
                })
                .on('confirmation', (confirmations, receipt) => {
                    resolve(receipt)
                })
                .on('error', () => {reject("Transaction Error")})
            })
        }catch(err){
            throw err;
        }
    }


    async changeMaxWithdrawal({amount}){
        try{
            let accounts = await window.web3.eth.getAccounts();
            let amountWithDecimals = this.toWei(amount);
            return new Promise ( (resolve, reject) => {
                self.contract.getContract().methods.changeMaxWithdrawal(
                    amountWithDecimals
                ).send({from : accounts[0]})
                .on('transactionHash', (hash) => {
                })
                .on('confirmation', (confirmations, receipt) => {
                    resolve(receipt)
                })
                .on('error', () => {reject("Transaction Error")})
            })
        }catch(err){
            throw err;
        }
    }

    async changeWithdrawalTimeLimit({amount}){
        try{
            let accounts = await window.web3.eth.getAccounts();
            let SCTime = Numbers.fromMinutesToSmartContracTime(amount);
            return new Promise ( (resolve, reject) => {
                self.contract.getContract().methods.changeReleaseTime(
                    SCTime
                ).send({from : accounts[0]})
                .on('transactionHash', (hash) => {
                })
                .on('confirmation', (confirmations, receipt) => {
                    resolve(receipt)
                })
                .on('error', () => {reject("Transaction Error")})
            })
        }catch(err){
            throw err;
        }
    }


    /**
     * @Functions
     */

    async deploy(){
        let accounts = await window.web3.eth.getAccounts();

        let params = [
            self.authorizedAddress,                 // Authorized Address
            self.ownerAddress                       // Owner Address
        ];

        let res = await self.contract.deploy(
            accounts[0],
            self.contract.getABI(), 
            self.contract.getJSON().bytecode, 
            params);
        self.contract.setAddress(res.contractAddress);
        self.contractAddress = res.contractAddress;
        return res;
    }

    getAddress(){
        return self.contractAddress || self.contract.getAddress();
    }

}



export default CasinoContractETH;