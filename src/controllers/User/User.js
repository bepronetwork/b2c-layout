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
  getCurrencyAddress,
  resendConfirmEmail,
  getJackpotPot,
  getProviderToken,
  sendFreeCurrencyRequest
} from "lib/api/users";
import moment from "moment";
import { Numbers } from "../../lib/ethereum/lib";
import Cache from "../../lib/cache/cache";
import ChatChannel from "../Chat";
import store from "../../containers/App/store";
import { setProfileInfo } from "../../redux/actions/profile";
import { setStartLoadingProcessDispatcher } from "../../lib/redux";
import { setModal } from "../../redux/actions/modal";
import { processResponse } from "../../lib/helpers";
import _, { startCase } from 'lodash';
import Pusher from 'pusher-js';
import { apiUrl } from "../../lib/api/apiConfig";
import { setMessageNotification } from "../../redux/actions/message";
import { formatCurrency } from "../../utils/numberFormatation";
import getCurrencySlug from "../../utils/getCurrencySlug";

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
        this.integrations = user.integrations ? user.integrations : app.integrations;
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
        return this.app.integrations.pusher ? this.app.integrations.pusher.key : '';
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
            this.getAllData(true);
        });
        
        /* Listen to Withdraws */
        this.channel.bind('withdraw', (data) => {

        });

        /* Listen to Jackpot */
        this.channel.bind('jackpot', async (data) => {
            await store.dispatch(setModal({key : 'JackpotModal', value : data.message}));
        });

        /* Listen to Update Wallet */
        this.channel.bind('update_balance', async (data) => {
            const resp = JSON.parse(data.message);
            const value = formatCurrency(resp.value);
            await this.updateBalance({ userDelta: Number(value) });
        });
    }

    hasLoaded = () => this.isLoaded;

    getBalance = (currency) => {
        const state = store.getState();
        currency = currency ? currency : state.currency;
        if(_.isEmpty(currency)){ return 0;}

        const wallet = this.getWallet({currency});
        if(_.isEmpty(wallet)){ return 0;}
        return wallet.playBalance;
    };

    getBalanceWithBonus = (currency) => {
        const state = store.getState();
        currency = currency ? currency : state.currency;
        if(_.isEmpty(currency)){ return 0;}

        const wallet = this.getWallet({currency});
        if(_.isEmpty(wallet)){ return 0;}
        return wallet.playBalance + wallet.bonusAmount;
    };

    getWallet = ({currency}) => {return this.user.wallet.find( w => new String(w.currency._id).toString().toLowerCase() == new String(currency._id).toString().toLowerCase())};

    getWallets = () => {
        let wallets = [...this.user.wallet];

        wallets.forEach(({ currency }) => {
            currency.slug = getCurrencySlug(currency.name)
        })
        
        return wallets;
    };

    getBalanceAsync = async () => Numbers.toFloat((await this.updateUser()).balance);

    getChat = () =>  this.chat;

    getChannel = () =>  this.channel;

    getDeposits = () => {
        if(!this.user.deposits) { return [] };

        return this.user.deposits.sort(function(a,b){
            return new Date(b.creation_timestamp) - new Date(a.creation_timestamp);
        });
    }
            
    getID = () => this.id;

    getUsername = () => this.username;

    getAppCustomization = () => this.app.customization;

    getAllData = async (reloadUser=false) => {
        if(reloadUser === true){ await this.updateUser() };
        setStartLoadingProcessDispatcher(6);
        this.isLoaded = true;
        await this.updateUserState();
    }

    getBalanceData = async () => {
        await this.updateUser();
        await this.updateUserState();
    }

    updateBalance = async ({ userDelta, amount, totalBetAmount }) => {
        const state = store.getState();
        const { currency } = state;

        this.user.wallet.forEach((w) => {
            if (new String(w.currency._id).toString().toLowerCase() == new String(currency._id).toString().toLowerCase()) {
                
                if (userDelta < 0) {

                    const delta = w.playBalance + userDelta;

                    if (_.has(w, 'bonusAmount') && w.bonusAmount > 0) {
                        const newPlayBalance = delta < 0 ? 0 : delta;
                        const newBonusAmount = delta < 0 ? w.bonusAmount + delta : w.bonusAmount;

                        w.playBalance = Math.max(0, newPlayBalance);
                        w.bonusAmount = Math.max(0, newBonusAmount);

                    } else {
                        const newPlayBalance = delta < 0 ? 0 : delta;

                        w.playBalance = Math.max(0, newPlayBalance);
                    }

                } else {

                    if (_.has(w, 'bonusAmount') && w.bonusAmount > 0) {
                        const newBonusAmount = w.bonusAmount + userDelta;

                        w.bonusAmount = Math.max(0, newBonusAmount);

                    } else {
                        const newPlayBalance = w.playBalance + userDelta;

                        w.playBalance = Math.max(0, newPlayBalance);
                    }
                }

                if (w.incrementBetAmountForBonus > w.minBetAmountForBonusUnlocked) {

                    const newPlayBalance = w.playBalance + w.bonusAmount;

                    w.bonusAmount = 0;
                    w.playBalance = Math.max(0, newPlayBalance);
                    w.incrementBetAmountForBonus = 0;

                } else if (_.has(w, 'incrementBetAmountForBonus')) {

                    const newIncrementBetAmountForBonus = w.incrementBetAmountForBonus + totalBetAmount;

                    w.incrementBetAmountForBonus = Math.max(0, newIncrementBetAmountForBonus);
                }
            }
        });

        if(this.app.addOn.pointSystem && (this.app.addOn.pointSystem.isValid == true) && amount) {
            const ratio = this.app.addOn.pointSystem.ratio.find( p => p.currency == currency._id ).value;
            const points = await this.getPoints();
            this.user.points = points + (amount * ratio);
        }

        await this.updateUserState();
    }

    updateBalanceWithoutBet = async ({amount}) => {
        const state = store.getState();
        const { currency } = state;

        this.user.wallet.forEach((w) => {
            if(new String(w.currency._id).toString().toLowerCase() == new String(currency._id).toString().toLowerCase()) {
                w.playBalance = w.playBalance + amount;
            }
        });

        await this.updateUserState();
    }

    updateUserState = async () => {
        await store.dispatch(setProfileInfo(this));
    }

    updateKYCStatus = status => {
        const verified = status.toLowerCase() === 'verified';

        this.user = {...this.user, kyc_needed: !verified, kyc_status: status };
        
        this.updateUserState();
    }

    getMyBets = async ({size, game, slug, tag}) => {
        try{
            // grab current state
            const state = store.getState();
            const { currency } = state;

            if(!this.user_id){return []}
            if(currency && currency._id){
                let res = await getMyBets({         
                    currency : currency._id,      
                    user: this.user_id,
                    size,
                    game,
                    slug,
                    tag
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
    
    getCountry = () => {
        const { country, country_acronym } = this.user;

        if (country && country_acronym) {
            const countryRefactor = startCase(country.toLowerCase());

            return {
                value: country_acronym,
                text: countryRefactor
            };
        }

        return false;
    };

    getBirthDate = () => {
        const { birthday } = this.user;

        if (birthday) {
            const birthDateRefactor = birthday.split("").splice(0, 10).join("");
            const birthDateReformat = moment(birthDateRefactor).locale("pt").format("L");

            return birthDateReformat;
        }

        return false;
    }

    updateUser = async () => {
        let user = await userAuth({
            user: this.user_id,
            app: this.app_id
        }, this.bearerToken);

        this.user = user;
        return user;
    }

    getUserEmail = () => {
        return this.user.email
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
            //let withdraws = await this.getWithdrawsAsync();
            //let withdraw = withdraws[withdraws.length-1];
            // Process Ask Withdraw API Call since can have errors
            if(!timeout){
                res = await processResponse(res);
            }
            return {...res};
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

    getAffiliateInfo = () => {
        return {
            id : this.user.affiliateId,
            userAmount : this.user.affiliateInfo.affiliatedLinks.length,
            percentageOnLevelOne : this.user.affilateLinkInfo.affiliateStructure.percentageOnLoss
        }
    }

    getAffiliateWallets = () => {
        return this.user.affiliateInfo.wallet;
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
        if(!this.user.withdraws) { return [] };

        return this.user.withdraws.sort(function(a,b){
            return new Date(b.creation_timestamp) - new Date(a.creation_timestamp);
        });
    }

    getWithdrawsAsync = async () => {
        let user = await this.updateUser();
        return user.withdraws;
    }

    createBet = async ({ result, gameId }) => {
        let res;

        try {
            const nonce = getNonce();
            // grab current state
            const state = store.getState();
            const { currency } = state;
            /* Create Bet API Setup */
            res = await createBet(
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

    resendConfirmEmail = async () => {
        try {

            return await resendConfirmEmail(
                {
                    app: this.app_id,
                    user: this.user_id
                },
                this.bearerToken
            );
        }catch(err){
            throw err;
        }
    };

    getPoints = async () => {
        return this.user.points;
    }

    getExternalId = async () => {
        return this.user.external_id;
    }

    isEmailConfirmed = async () => {
        return this.user.email_confirmed;
    }

    isKycConfirmed = async () => {
        return this.user.kyc_needed;
    }

    kycStatus = async () => {
        return this.user.kyc_status;
    }

    lastTimeFree = async () => {
        return this.user.lastTimeCurrencyFree;
    }


    getJackpotPot = async ({currency_id}) => {
        try {
            if(!this.user_id){return []}
            if(currency_id){
                let res = await getJackpotPot({     
                    app: this.app_id,        
                    user: this.user_id,
                    currency : currency_id
                }, this.bearerToken);

                //workaround to dont show "Jackpot not exist in App" error message notifitication
                //should be removed when Jackpot will be in the addOns list
                if(res.data.status == 56 || res.data.status == 45) {
                    return { pot: 0 };
                }
                //finish

                return await processResponse(res);
            }else{
                return [];
            }
      
        }catch(err){
            console.log(err)
            throw err;
        }
    }

    getProviderToken = async ({game_id, ticker}) => {
        try {
            if(!this.user_id){return []}
            let res = await getProviderToken({     
                app: this.app_id,        
                user: this.user_id,
                game_id,
                ticker
            }, this.bearerToken);

            return await processResponse(res);
      
        }catch(err){
            console.log(err)
            throw err;
        }
    }

    sendFreeCurrencyRequest = async ({currency_id}) => {
        try {
            if(!this.user_id){return []}
            let res = await sendFreeCurrencyRequest({     
                app: this.app_id,        
                user: this.user_id,
                currency : currency_id
            }, this.bearerToken);

            return await processResponse(res);
      
        }catch(err){
            console.log(err)
            throw err;
        }
    }
}
