import { getMetamaskAccount, getNonce } from "lib/metamask";
import {
  updateUserWallet,
  requestWithdraw,
  finalizeWithdraw,
  cancelWithdraw,
  requestWithdrawAffiliate,
  createBet,
  getMyBets,
  set2FA,
  userAuth,
  getCurrencyAddress
} from "lib/api/users";
import { Numbers } from "../../lib/ethereum/lib";
import Cache from "../../lib/cache/cache";
import ChatChannel from "../Chat";
import store from "../../containers/App/store";
import { setProfileInfo } from "../../redux/actions/profile";
import { getPastTransactions, getTransactionDataCasino } from "../../lib/ethereum/lib/Etherscan";
import { setStartLoadingProcessDispatcher } from "../../lib/redux";
import { processResponse } from "../../lib/helpers";
import _ from 'lodash';

export default class User {
    constructor({
        platformAddress,
        tokenAddress,
        decimals,
        appId,
        user,
        app
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
        this.integrations = app.integrations;
        this.address = user.address;
        this.user = user;
        this.isLoaded = false;
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
            setStartLoadingProcessDispatcher(1);
            setStartLoadingProcessDispatcher(2);
            await this.setupChat();
            setStartLoadingProcessDispatcher(3);
            setStartLoadingProcessDispatcher(4);
            await this.getAllData();
        }catch(err){
            console.log(err)
        }
    }

    hasLoaded = () => this.isLoaded;

    getBalance = (currency) => {
        const state = store.getState();
        currency = currency ? currency : state.currency;
        if(_.isEmpty(currency)){ return 0;}
        return this.getWallet({currency}).playBalance;
    };
    getWallet = ({currency}) => {return this.user.wallet.find( w => new String(w.currency._id).toString().toLowerCase() == new String(currency._id).toString().toLowerCase())};
    
    getBalanceAsync = async () => Numbers.toFloat((await this.updateUser()).balance);

    getChat = () =>  this.chat;

    getDeposits = () => this.user.deposits;
    
    getDepositsAsync = async () => await this.__getDeposits();

    getTimeForWithdrawal = () => this.params.timeToWithdraw;
    
    getApprovedWithdraw = () => this.params.decentralizeWithdrawAmount;
    
    getApprovedWithdrawAsync = async () => await this.__getApprovedWithdraw();

    getID = () => this.id;

    getUsername = () => this.username;

    getAppCustomization = () => this.app.customization;

    getAllData = async () => {
        await this.updateUser();
        setStartLoadingProcessDispatcher(6);
        this.isLoaded = true;
        await this.updateUserState();
    }

    getBalanceData = async () => {
        await this.updateUser();
        await this.updateUserState();
    }

    updateUserState = async () => {
        /* Add Everything to the Redux State */  
        await store.dispatch(setProfileInfo(this));
    }

    getMyBets = async ({size}) => {
        try{
            // grab current state
            const state = store.getState();
            const { currency } = state;

            if(!this.user_id){return []}
            if(currency && currency._id){
                let res = await getMyBets({         
                    currency : currency._id,      
                    user: this.user_id,
                    size
                }, this.bearerToken);
                return await processResponse(res);
            }else{
                return [];
            }
      
        }catch(err){
            console.log(err)
            throw err;
        }
    }

    setupChat = async () => {
        this.chat = new ChatChannel({
            id : this.id, 
            name : this.username,
            publicKey : this.integrations.chat.publicKey,
            token : this.user.integrations.chat.token

        });
        await this.chat.__init__();
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
        let user = await userAuth({
            user: this.user_id
        }, this.bearerToken);

        this.user = user;
        return user;
    }

    getContract = () => {
        return this.casinoContract;
    }

    getTokenAmount = async () => {
        let address = await getMetamaskAccount();
        if(!address){ address = '0x' }
        let amount = Numbers.toFloat(Numbers.fromDecimals(await this.casinoContract.getERC20Token().getTokenAmount(address), this.decimals))
        return amount;
    }

    confirmDeposit = async ({ amount, transactionHash, currency }) => {
        try {
            const nonce = getNonce();
            /* Update API Wallet Update */
            let res = await updateUserWallet(
                {
                    user: this.user_id,
                    amount,
                    app: this.app_id,
                    nonce : nonce,
                    transactionHash: transactionHash,
                    currency : currency._id
                },
                this.bearerToken
            );
            await processResponse(res);
            return res;
        } catch (err) {
            throw err;
        }
    };

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
            let testedTxs = allTxs.slice(0, 20);  
            let unconfirmedDepositTxs = (await Promise.all(testedTxs.map( async tx => {
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
                return {...tx, isConfirmed}
            }
        }))).filter(el => el != null)
    }


    __getApprovedWithdraw = async () => {
        try{
            let address = await getMetamaskAccount();
            if(!address){ return 0 }
            let decimalAmount = await this.casinoContract.getApprovedWithdrawAmount(address);
            return Numbers.fromDecimals(decimalAmount, this.decimals);
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

    askForWithdraw = async ({amount, currency, address}) => {
        try {
            var nonce = getNonce();
            var res = { };
            let timeout = false;

            try{
                /* Ask Permission to Withdraw */
                res = await requestWithdraw(
                    {
                        app: this.app_id,
                        user: this.user_id,
                        address,
                        tokenAmount : parseFloat(amount),
                        currency : currency._id,
                        nonce
                    },
                    this.bearerToken
                );

            }catch(err){
                //Timeout Error - But Worked
                timeout = true;
            }
            
            // Get Withdraw
            let withdraws = await this.getWithdrawsAsync();
            let withdraw = withdraws[withdraws.length-1];
            // Process Ask Withdraw API Call since can have errors
            if(!timeout){
                res = await processResponse(res);
            }
            return {...res, withdraw};
        } catch (err) {
            throw err;
        }
    }

    askForWithdrawAffiliate = async ({amount, currency, address}) => {
        try {
            var nonce = getNonce();
            var res = { };
            let timeout = false;

            try{
                /* Ask Permission to Withdraw */
                res = await requestWithdrawAffiliate(
                    {
                        app: this.app_id,
                        user: this.user_id,
                        address,
                        tokenAmount : parseFloat(amount),
                        currency : currency._id,
                        nonce
                    },
                    this.bearerToken
                );

            }catch(err){
                //Timeout Error - But Worked
                timeout = true;
            }
            // Get Withdraw
            let withdraws = await this.getWithdrawsAsync();
            let withdraw = withdraws[withdraws.length-1];
            // Process Ask Withdraw API Call since can have errors
            if(!timeout){
                res = await processResponse(res);
            }
            return {...res, withdraw};
        } catch (err) {
            throw err;
        }
    }

    getAffiliateInfo = (currency) => {
        const state = store.getState();
        currency = currency ? currency : state.currency;
        if(_.isEmpty(currency)){ return 0;}
        console.log(this.user)
        let wallet = this.user.affiliateInfo.wallet.find( w => new String(w.currency._id).toString().toLowerCase() == new String(currency._id).toString().toLowerCase());
        
        return {
            id : this.user.affiliateId,
            wallet,
            userAmount : this.user.affiliateInfo.affiliatedLinks.length,
            percentageOnLevelOne : this.user.affilateLinkInfo.affiliateStructure.percentageOnLoss
        }
    }

    getAppCurrencyTicker = () => {
        return this.app.currencyTicker;
    } 
      
    getAppTokenAddress = () => {
        return this.tokenAddress;
    }

    finalizeWithdraw = async ({withdraw_id, tx}) => {
        try {
            /* Finalize Withdraw to API */

            return await finalizeWithdraw(
                {
                    app: this.app_id,
                    withdraw_id : withdraw_id,
                    user: this.user_id,
                    transactionHash: tx
                },
                this.bearerToken
            );
        }catch(err){
            throw err;
        }
    }
    getWithdraws = () => {
        return this.user.withdraws || [];
    }

    getWithdrawsAsync = async () => {
        let user = await this.updateUser();
        return user.withdraws;
    }

    getOneNotConfirmedWithdrawForAmountAsync  = async () => {
        let withdraws = await this.getWithdrawsAsync();
        return withdraws.find(withdraw => !withdraw.confirmed);
    }



    createBet = async ({ result, gameId }) => {
        try {
            const nonce = getNonce();
            // grab current state
            const state = store.getState();
            const { currency } = state;
            /* Create Bet API Setup */
            let res = await createBet(
                {
                    currency : currency._id,
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

    set2FA = async ({token, secret}) => {
        try{
            let res = await set2FA({               
                '2fa_secret' : secret,
                '2fa_token' : token,
                user: this.user_id
            },
            this.bearerToken);
            return res;
        } catch(err){
            throw err;
        }
    }

    getCurrencyAddress = async ({currency_id}) => {
        try {
            if(!this.user_id){return []}
            if(currency_id){
                let res = await getCurrencyAddress({         
                    currency : currency_id,      
                    id: this.user_id,
                    app: this.app_id
                }, this.bearerToken);
                return await processResponse(res);
            }else{
                return [];
            }
      
        }catch(err){
            console.log(err)
            throw err;
        }
    }
}
