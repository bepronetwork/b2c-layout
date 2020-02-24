import { getNonce } from "lib/metamask";
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
import { setStartLoadingProcessDispatcher } from "../../lib/redux";
import { processResponse } from "../../lib/helpers";
import _ from 'lodash';
import Pusher from 'pusher-js';
import { apiUrl, PUSHER_API_KEY } from "../../lib/api/apiConfig";
import { setMessageNotification } from "../../redux/actions/message";

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
            deposits : [],
        }
        this.__init__();
    }

    /**
     * @use Initialization Function
     */

    __init__ = async () =>  {
        try{
            setStartLoadingProcessDispatcher(1);
            await this.setupChat();
            setStartLoadingProcessDispatcher(2);
            await this.getAllData();
            setStartLoadingProcessDispatcher(3);
            this.listenAppPrivateChannel();
            setStartLoadingProcessDispatcher(6);

        }catch(err){
            console.log(err)
        }
    }
    getPusherAPIKey = () => {
        return this.integrations ? this.integrations.pusher.key : '';
    }

    listenAppPrivateChannel = () => {
        this.pusher = new Pusher(this.getPusherAPIKey(), 
        { 
            cluster : 'eu',
            forceTLS: true,
            authEndpoint: `${apiUrl}/api/users/pusher/auth`,
        }); 
        this.channel = this.pusher.subscribe(`private-${this.id}`);

        /* Listen to Deposits */
        this.channel.bind('deposit', async (data) => {
            await store.dispatch(setMessageNotification(data.message));
            this.getAllData();
        });
        /* Listen to Withdraws */
        this.channel.bind('withdraw', (data) => {

        });
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


    getTokenAmount = async () => {
        return 0;
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
