import { enableMetamask, getMetamaksAccount, getNonce } from "lib/metamask";
import CasinoContract from "lib/ethereum/CasinoContract";
import {
  updateUserWallet,
  requestWithdraw,
  finalizeWithdraw,
  cancelWithdraw,
  createBet,
  getMyBets
} from "lib/api/users";
import CryptographySingleton from "lib/api/Cryptography";
import { Numbers } from "../../lib/ethereum/lib";
import { getCurrentUser, login } from 'lib/api/users';
import codes from 'lib/config/codes';
import { processResponse } from "../../lib/api/apiConfig";
import Cache from "../../lib/cache/cache";
import ChatChannel from "../Chat";
import store from "../../containers/App/store";
import { setProfileInfo } from "../../redux/actions/profile";
import { getPastTransactions, getTransactionDataCasino } from "../../lib/ethereum/lib/Etherscan";

export default class User {
    constructor({
        platformAddress,
        tokenAddress,
        decimals,
        appId,
        user
    }) {
        // Logged
        this.id = user.id;
        this.user_id = user.id;
        this.app_id = appId;
        this.platformAddress = platformAddress;
        this.tokenAddress = tokenAddress;
        this.decimals = decimals;
        this.bearerToken = user.bearerToken;
        this.balance  = user.balance;
        this.username = user.username;
        this.address = user.address;
        this.user = user;
        this.app = Cache.getFromCache("appInfo");
        this.params = {
            timeToWithdraw : 0,
            deposits : [],
            decentralizeWithdrawAmount : 0
        }
        this.__init__();
    }

    /**
     * @use Initialization Function
     */

    __init__ = async () =>  {
        try{
            this.setupCasinoContract();
            await this.setupChat();
            this.connectMetamask();
            this.getAllData();
        }catch(err){
            console.log(err)
        }
    }

    getBalance = () => {
        return this.user.balance;
    }

    getChat = () => {
        return this.chat;
    }

    getDeposits = () => this.params.deposits;

    getTimeForWithdrawal = () => this.params.timeToWithdraw;

    getApprovedWithdraw = () => this.params.decentralizeWithdrawAmount;

    getID = () => this.id;
    
    isValidAddress = async () => {
        let userMetamaskAddress = await this.getMetamaskAddress();
        return new String(this.getAddress()).toLowerCase() == new String(userMetamaskAddress).toLowerCase();
    }

    getAllData = async () => {
        await this.updateUser();
        await this.updateDecentralizedStats();
        await this.updateUserState();
    }

    getBalanceData = async () => {
        await this.updateUser();
        await this.updateUserState();
    }

    updateDecentralizedStats = async () => {
        this.params.decentralizeWithdrawAmount = await this.__getApprovedWithdraw();
        this.params.timeToWithdraw = await this.__getTimeForWithdrawal();
        this.params.deposits = await this.__getDeposits();
    }

    updateUserState = async () => {
        /* Add Everything to the Redux State */  
        await store.dispatch(setProfileInfo(this));
    }

    connectMetamask = () => {
        if(window.ethereum){
            window.ethereum.on('accountsChanged', (accounts) => {
                // Time to reload your interface with accounts[0]!
                this.setMetamaskAddress(accounts[0]);
            })
            
            window.ethereum.on('networkChanged', (netId) =>  {
                console.log(netId);
            })
        }  
    }

    getMyBets = async ({size}) => {
        try{
            if(!this.user_id){return []}
            let res = await getMyBets({               
                user: this.user_id,
                size
            }, this.bearerToken);
            return await processResponse(res);
        }catch(err){
            console.log(err)
            throw err;
        }
    }

    setupChat = async () => {
        let chat = new ChatChannel({id : this.id, name : this.username});
        await chat.__init__();
        let ObjectChat = chat;
        ObjectChat.cc.transportManager.client = null;
        this.chat = ObjectChat;
    }

    getMessages = () => {
        return this.chat.getMessages();
    }

    sendMessage = async ({message, data}) => {
        try{
            return await this.chat.sendMessage({message, data});
        } catch (err){
            throw err;
        }
    }

    updateUser = async () => {
        let cache = Cache.getFromCache('Authentication');
        if(cache){
            let user = await login({
                username : cache.username, 
                password : cache.password
            });
            this.user = user;
            return user;
        }

    }

    setupCasinoContract() {
        /* Create Casino Instance */
        this.casinoContract = new CasinoContract({
            web3: window.web3,
            contractAddress: this.platformAddress,
            tokenAddress: this.tokenAddress,
            decimals: this.decimals
        });
    }

    getTokenAmount = async () => {
        let accounts = await window.web3.eth.getAccounts();
        let amount = Numbers.toFloat(Numbers.fromDecimals(await this.casinoContract.getERC20Token().getTokenAmount(accounts[0]), this.decimals))
        return amount;
    }

    createDeposit = async ({ amount }) => {
        try {
            /* Enable Metamask Auth */
            await enableMetamask("eth");
            let accounts = await window.web3.eth.getAccounts();
            const nonce = getNonce();
            /* Deposit Tokens */
            const resEthereum = await this.casinoContract.depositTokens({
                address : accounts[0],
                amount,
                nonce : nonce
            });
            console.log(resEthereum);

            /* Update API Wallet Update */
            let res = await updateUserWallet(
                {
                    user: this.user_id,
                    amount,
                    app: this.app_id,
                    nonce : nonce,
                    transactionHash: resEthereum.transactionHash
                },
                this.bearerToken
            );
            await processResponse(res);
            return res;
        } catch (err) {
            // TO DO : Verify if User declined Metamask or there was another type of error
            // TO DO : Display the Error
            throw err;
        }
    };

    confirmDeposit = async ({nonce, amount, transactionHash}) => {
        try {
            /* Update API Wallet Update */
            let res = await updateUserWallet(
                {
                    user: this.user_id,
                    amount,
                    app: this.app_id,
                    nonce : nonce,
                    transactionHash: transactionHash
                },
                this.bearerToken
            );
            await processResponse(res);
            return res;
        } catch (err) {
            // TO DO : Verify if User declined Metamask or there was another type of error
            // TO DO : Display the Error
            throw err;
        }
    }

    __getTimeForWithdrawal = async () => {
        try{
            /* Enable Metamask Auth */
            await enableMetamask("eth");
            let accounts = await window.web3.eth.getAccounts();
            return await this.casinoContract.getTimeForWithdrawal(accounts[0]);
        }catch(err){
            throw err;
        }
    }

    cancelWithdrawAPI = async () => {
        try{
            /* Cancel Withdraw Response */
            let res = await cancelWithdraw({               
                app: this.app_id,
                user: this.user_id
            },
            this.bearerToken);
            await processResponse(res);
            return true;
        }catch(err){
            console.log(err)
            throw err;
        }
    }

    getUnconfirmedBlockchainDeposits = async (address) => {
        try{            
            var platformAddress =  this.platformAddress;
            var platformTokenAddress =  this.tokenAddress;
            var allTxs = (await getPastTransactions(address)).result;         
            let unconfirmedDepositTxs = (await Promise.all(allTxs.map( async tx => {
                let res_transaction = await window.web3.eth.getTransaction(tx.hash);
                let res_transaction_recipt = await window.web3.eth.getTransactionReceipt(tx.hash);
                let transactionData = getTransactionDataCasino(res_transaction, res_transaction_recipt);
                if(!transactionData){return null}
                return {
                    amount: Numbers.fromDecimals(transactionData.tokenAmount, this.decimals),
                    to : tx.to,
                    tokensTransferedTo : transactionData.tokensTransferedTo,
                    creation_timestamp: tx.timestamp,
                    transactionHash: tx.hash
                }
            }))).filter(el => el != null).filter( tx => {
                return (
                    new String(tx.to).toLowerCase().trim() == new String(platformAddress).toLowerCase().trim()
                    && new String(tx.tokensTransferedTo).toLowerCase().trim() == new String(platformAddress).toLowerCase().trim()
                    )
            })
            return unconfirmedDepositTxs;
        }catch(err){
            throw err;
        }
    }

    __getDeposits = async () => {
        var address = this.getAddress();
        let depositsApp = this.user.deposits || [];
        let allTxsDeposits = await this.getUnconfirmedBlockchainDeposits(address);
        return (await Promise.all(allTxsDeposits.map( async tx => {
            var isConfirmed = false, deposit = null;
            for(var i = 0; i < depositsApp.length; i++){
                if(new String(depositsApp[i].transactionHash).toLowerCase().trim() == new String(tx.transactionHash).toLowerCase().trim()){
                    isConfirmed = true;
                    deposit = depositsApp[i];
                }
            }
            if(isConfirmed){
                return {...deposit, isConfirmed}
            }else{
                console.log(tx)
                return {...tx, isConfirmed}
            }
        }))).filter(el => el != null)
    }


    __getApprovedWithdraw = async () => {
        try{
            /* Enable Metamask Auth */
            await enableMetamask("eth");
            let accounts = await window.web3.eth.getAccounts();
            let decimalAmount = await this.casinoContract.getApprovedWithdrawAmount(accounts[0]);
            return Numbers.fromDecimals(decimalAmount, this.decimals);
        }catch(err){
            throw err;
        }
    }

    getWithdrawalTimeRelease = async () => {
        try{
            return await this.casinoContract.getWithdrawalTimeRelease();
        }catch(err){
            throw err;
        }
    }

    getMaxWithdrawal = async () => {
        try{
            return Numbers.fromBigNumberToInteger(await this.casinoContract.getMaxWithdrawal(), 36);
        }catch(err){
            throw err;
        }
    }

    getMaxDeposit = async () => {
        try{
            return Numbers.fromBigNumberToInteger(await this.casinoContract.getMaxDeposit(), 36);
        }catch(err){
            throw err;
        }
    }

    cancelWithdrawals = async () => {
        try{
            /* Cancel Withdraws in API */
            await this.cancelWithdrawAPI();
            return true;
        }catch(err){
            throw err;
        }
    }

    getAddress =  () => {
        return this.user.address;
    }

    setMetamaskAddress = (address) => {
        this.metamaskAddress = address;
        this.updateUserState();
    }

    getMetamaskAddress = async () => {
        if(this.metamaskAddress){return this.metamaskAddress};
        
        /* Enable Metamask Auth */
        await enableMetamask("eth");
        let accounts = await window.web3.eth.getAccounts();
        return accounts[0];
    }

    askForWithdraw = async ({amount}) => {
        try {
            var res;
            /* Enable Metamask Auth */
            await enableMetamask("eth");
            let accounts = await window.web3.eth.getAccounts();
            var nonce = getNonce();
            var userBalance = this.getBalance();
            res = {...res, nonce};
            // Get Signature
            let { signature } = await CryptographySingleton.getUserSignature({
                address : accounts[0], winBalance :  Numbers.toFloat(userBalance), nonce, decimals : this.decimals,
                category : codes.Withdraw
            });


            
            var res_with;
            try{
                /* Ask Permission to Withdraw */
                res_with = await requestWithdraw(
                    {
                        app: this.app_id,
                        user: this.user_id,
                        signature,
                        address     : accounts[0],
                        tokenAmount : Numbers.toFloat(amount),
                        newBalance  : Numbers.toFloat(userBalance),
                        nonce
                    },
                    this.bearerToken
                );
            }catch(err){
                //Timeout Error - But Worked
                return res;
            }

            return await processResponse(res_with);

        } catch (err) {
            throw err;
        }
    }

    getAppCurrencyTicker = () => {
        return this.app.currencyTicker;
    }   

    createWithdraw = async ({ amount, nonce, withdraw_id }) => {
        try {
            /* Enable Metamask Auth */
            await enableMetamask("eth");
            let accounts = await window.web3.eth.getAccounts();

            let user = await getCurrentUser()

            // Get Signature
            let { signature } = await CryptographySingleton.getUserSignature({
                address : accounts[0], winBalance :  Numbers.toFloat(user.balance), nonce, decimals : this.decimals,
                category : codes.Withdraw
            });
            /* Run Withdraw Function */
            const resEthereum = await this.casinoContract.withdrawTokens({
                address : accounts[0],
                amount,
                nonce
            });

            /* Finalize Withdraw to API */
            let res_fin = await finalizeWithdraw(
                {
                    app: this.app_id,
                    withdraw_id : withdraw_id,
                    user: this.user_id,
                    address : accounts[0],
                    tokenAmount: amount,
                    signature : signature,
                    transactionHash: resEthereum.transactionHash,
                    nonce
                },
                this.bearerToken
            );

            await processResponse(res_fin);

        } catch (err) {
            throw err;
        }
    };

    getWithdraws = () => {
        return this.user.withdraws || [];
    }


    createBet = async ({ result, gameId }) => {
        try {
            const nonce = getNonce();

            /* Create Bet API Setup */
            let res = await createBet(
                {
                    user: this.user_id,
                    app: this.app_id,
                    game: gameId,
                    result,
                    nonce
                },
                this.bearerToken
            );
            return res;
        } catch (err) {
            throw err;
        }
    };


    getMessage = () => {
        return this.message;
    }

    setMessage = (message) => {
        this.message = message;
    }
}
