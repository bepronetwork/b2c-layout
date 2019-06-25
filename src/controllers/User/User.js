import { enableMetamask, getMetamaksAccount, getNonce } from "lib/metamask";
import CasinoContract from "lib/ethereum/CasinoContract";
import {
  updateUserWallet,
  requestWithdraw,
  finalizeWithdraw,
  cancelWithdraw,
  createBet
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

export default class User {
    constructor({
        userId,
        platformAddress,
        tokenAddress,
        decimals,
        bearerToken,
        appId,
        user,
        app
    }) {
    
        this.id = userId;
        this.user_id = userId;
        this.app_id = appId;
        this.platformAddress = platformAddress;
        this.tokenAddress = tokenAddress;
        this.decimals = decimals;
        this.bearerToken = bearerToken;
        this.balance  = user.balance;
        this.username = user.username;
        this.address = user.address;
        this.user = user;
        this.app = Cache.getFromCache("appInfo");
        this.__init__();
    }

    /**
     * @use Initialization Function
     */

    __init__ = async () =>  {
        this.setupCasinoContract();
        await this.setupChat();
        this.connectMetamask();
        this.updateUserState();
    }

    updateUserState = async () => {
        /* Add Everything to the Redux State */  
        await store.dispatch(setProfileInfo(this));
    }

    connectMetamask = () => {
        window.ethereum.on('accountsChanged', (accounts) => {
            // Time to reload your interface with accounts[0]!
            this.setMetamaskAddress(accounts[0]);
        })
        
        window.ethereum.on('networkChanged', (netId) =>  {
            
        })
    }

    setupChat = async () => {
        this.chat = new ChatChannel({id : this.id, name : this.username});
        await this.chat.__init__();
    }

    getMessages = () => {
        return this.chat.getMessages();
    }

    sendMessage = async ({message, data}) => {
        await this.chat.sendMessage({message, data});
    }

    updateUser = async () => {
        let cache = Cache.getFromCache('Authentication');
        let user = await login({
            username : cache.username, 
            password : cache.password
        });
        this.user = user;
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

        /* Update API Wallet Update */
        let res =  await updateUserWallet(
            {
                user: this.user_id,
                amount,
                app: this.app_id,
                nonce : nonce,
                transactionHash: resEthereum.transactionHash
            },
            this.bearerToken
        );

        return res;
        } catch (err) {
            // TO DO : Verify if User declined Metamask or there was another type of error
            // TO DO : Display the Error
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


    getApprovedWithdraw = async () => {
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

    cancelWithdrawals = async () => {
        try{
            /* Enable Metamask Auth */
            await enableMetamask("eth");
            let accounts = await window.web3.eth.getAccounts();
            /* Cancel Withdraws in SC */
            await this.casinoContract.cancelWithdraw({address : accounts[0]});
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
            res = {...res, nonce};
            let user = await getCurrentUser()
            // Get Signature
            let { signature } = await CryptographySingleton.getUserSignature({
                address : accounts[0], winBalance :  Numbers.toFloat(user.balance), nonce, decimals : this.decimals,
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
                        newBalance  : Numbers.toFloat(user.balance),
                        nonce
                    },
                    this.bearerToken
                );
            }catch(err){
                //Timeout Error - But Worked
                return res;
            }

            await processResponse(res_with);
            return res;

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
            console.log(accounts[0], amount, nonce);
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

            console.log(res_fin)
            await processResponse(res_fin);

        } catch (err) {
            throw err;
        }
    };

    getWithdraws = () => {
        return this.user.withdraws || [];
    }


    createBet = async ({ amount, result, gameId }) => {
        try {
        /* Enable Metamask Auth */
        await enableMetamask("eth");

        /* Get Metamask Account Address */
        const accAddress = await getMetamaksAccount();
        const nonce = getNonce();

        /* Create Bet API Setup */
        return await createBet(
            {
                user: this.user_id,
                app: this.app_id,
                game: gameId,
                result,
                address: accAddress,
                nonce
            },
            this.bearerToken
        );
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
