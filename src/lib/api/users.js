import axios from "axios";
import handleError from "./handleError";
import { setProfileInfo } from "../../redux/actions/profile";
import { setMessageNotification } from '../../redux/actions/message';
import Cache from "../../lib/cache/cache";
import store from ".../../containers/App/store";
import { apiUrl, appId, apiUrlWithdraw } from "./apiConfig";
import { getWebsite } from "../../lib/helpers";
import delay from 'delay';

// Create an instance using the config defaults provided by the library
// At this point the timeout config value is `0` as is the default for the library
const instance = axios.create();
let SEC = 200;
// Override timeout default for the library
// Now all requests using this instance will wait 2.5 seconds before timing out
instance.defaults.timeout = SEC*1000;

export async function register({ username, password, email, address, affiliateLink, birthDate, userCountry }) {
    const postData = {
        username,
        email,
        password,
        name: username,
        app: appId,
        address: address,
        birthday: birthDate,
        country: userCountry.text,
        country_acronym: userCountry.value,
        affiliateLink : (affiliateLink) ? new String(affiliateLink).toString() : ''
    }
    if(postData.affiliateLink == false){
        delete postData.affiliateLink;
    }

    try {
        const response = await axios.post(`${apiUrl}/api/users/register`, postData);
        const { status, message } = response.data.data;

        if (status !== 200) {
            if (status === 59) {
                window.location.href = getWebsite();
                return false;
            }
            return response.data.data;
        }

        return {
            status,
            balance: message.wallet.playBalance,
            id: message._id,
            username: message.username
        };
    } catch (error) {
        return handleError(error);
    }
}

export async function login({ username, password }) {
    try {
        const response = await axios.post(`${apiUrl}/api/users/login`, {
            username,
            password,
            app : appId
        });
        const { status, message } = response.data.data;

        if (status !== 200) {
            if (status === 59) {
                window.location.href = getWebsite();
                return false;
            }
            return response.data.data;
        }

        return {
            address : message.address,
            status,
            balance: message.wallet.playBalance,
            id  : message.id,
            bearerToken : message.bearerToken,
            username    : message.username,
            withdraws   : message.withdraws,
            deposits    : message.deposits,
            ...message
        };
    } catch (error) {
        return handleError(error);
    }
}

export async function login2FA({ username, password, token }) {
    try {
        const response = await axios.post(`${apiUrl}/api/users/login/2fa`, {
            username,
            password,
            "2fa_token": token,
            app : appId
        });

        const { status, message } = response.data.data;

        if (status !== 200) {
            if (status === 59) {
                window.location.href = getWebsite();
                return false;
            }
            return response.data.data;
        }

        return {
            address : message.address,
            status,
            balance: message.wallet.playBalance,
            id  : message.id,
            bearerToken : message.bearerToken,
            username    : message.username,
            withdraws   : message.withdraws,
            deposits    : message.deposits,
            ...message
        };
    } catch (error) {
        return handleError(error);
    }
}

export async function askResetPassword(username_or_email) {
    try {
        const response = await axios.post(`${apiUrl}/api/users/password/reset/ask`, {
            username_or_email
        });

        if (response.data.data.status !== 200) {
            return response.data.data;
        }
        
        return response;

    } catch (error) {
        return handleError(error);
    }
}

export async function setNewPassword(user_id, token, password) {
    try {
        const response = await axios.post(`${apiUrl}/api/users/password/reset/set`, {
            user_id,
            token,
            password
        });

        if (response.data.data.status !== 200) {
            return response.data.data;
        }
        
        return response;

    } catch (error) {
        return handleError(error);
    }
}

export async function confirmEmail(app, token) {
    try {
        const response = await axios.post(`${apiUrl}/api/users/email/confirm`, {
            app,
            token
        });

        if (response.data.data.status !== 200) {
            return response.data.data;
        }
        
        return response;

    } catch (error) {
        return handleError(error);
    }
}

/**
 *
 * @param {*} params
 * @param {*} bearerToken
 * @name Resend Email Confirmation
 * @use Send email to confirm account
 */

export async function resendConfirmEmail(params, bearerToken, payload) {
    try{
        let res = await fetch(`${apiUrl}/api/users/email/resend`, {
            method : 'POST',
            timeout: 1000*1000,
            headers : addSecurityHeader({bearerToken, payload :  payload || params.user}),
            body : JSON.stringify(params)})
        return res.json();
    }catch(err){
        throw err;
    }  
}

export async function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem("user"));
    } catch (error) {
        return handleError(error);
    }
}

export async function updateUserBalance(user, setUser) {

    try {
        const res = await fetch(`${apiUrl}/api/users/summary`, {
            method : 'POST',
            timeout: 1000*1000,
            headers : addSecurityHeader({bearerToken : user.bearerToken, payload : user.id}),
            body : JSON.stringify({
                user : user.id,
                type : 'WALLET'
            })}
        )
        let response = await res.json();
        const newUser = {
            ...user,
            balance: response.data.message["0"].playBalance
        };

        return setUser(newUser);
    } catch (error) {
        return handleError(error);
    }
}

export async function logout() {
    Cache.setToCache('user', null);
    Cache.setToCache('Authentication', null);
    localStorage.removeItem("diceHistory");
    localStorage.removeItem("rouletteHistory");
    localStorage.removeItem("flipHistory");
    localStorage.removeItem("plinko_variation_1History");
    localStorage.removeItem("wheelHistory");
    localStorage.removeItem("wheel_variation_1History");
    localStorage.removeItem("kenoHistory");
    localStorage.removeItem("slotsHistory");
    localStorage.removeItem("diamondsHistory");
    localStorage.removeItem("customization");
    localStorage.removeItem("affiliate");
    localStorage.removeItem("appInfo");
    localStorage.removeItem("user");
    sessionStorage.clear();
    await store.dispatch(setProfileInfo(null));
    window.location.reload();
    window.location.href = '/';
}

/**
 *
 * @param {*} params
 * @param {*} bearerToken
 * @name Request Withdraw
 * @use Once User Wants to Withdraw Decentralized
 */

export async function requestWithdraw(params, bearerToken, payload) {
    try{
        let res = await fetch(`${apiUrlWithdraw}/api/users/requestWithdraw`, {
            method : 'POST',
            timeout: 1000*1000,
            headers : addSecurityHeader({bearerToken, payload :  payload || params.user}),
            body : JSON.stringify(params)})
        return res.json();
    }catch(err){
        throw err;
    }
}

/**
 *
 * @param {*} params
 * @param {*} bearerToken
 * @name Request Withdraw Affiliates
 * @use Once User Wants to Withdraw Decentralized
 */

export async function requestWithdrawAffiliate(params, bearerToken, payload) {
    try{
        let res = await fetch(`${apiUrlWithdraw}/api/users/affiliate/requestWithdraw`, {
            method : 'POST',
            timeout: 1000*1000,
            headers : addSecurityHeader({bearerToken, payload :  payload || params.user}),
            body : JSON.stringify(params)})
        return res.json();
    }catch(err){
        throw err;
    }
}

/**
 *
 * @param {*} params
 * @param {*} bearerToken
 * @name Request Withdraw
 * @use Once User Wants to Withdraw Decentralized
 */

export async function cancelWithdraw(params, bearerToken, payload) {
    try{
        let res = await fetch(`${apiUrl}/api/users/cancelWithdraw`, {
            method : 'POST',
            headers : addSecurityHeader({bearerToken, payload :  payload || params.user}),
            body : JSON.stringify(params)})
        return res.json();
    }catch(err){
        throw err;
    }    
}

/**
 *
 * @param {*} params
 * @param {*} bearerToken
 * @name Finalize Withdraw
 * @use Once User has Finalized or just canceled his Withdraw
 */

export async function finalizeWithdraw(params, bearerToken, payload) {
    try{
        let res = await fetch(`${apiUrl}/api/users/finalizeWithdraw`, {
            method : 'POST',
            timeout: 1000*1000,
            headers : addSecurityHeader({bearerToken, payload :  payload || params.user}),
            body : JSON.stringify(params)})
        return res.json();
    }catch(err){
        throw err;
    }  
}

/**
 *
 * @param {*} params
 * @param {*} bearerToken
 * @name Create Bet
 * @use Once User wants to bet
 */

export async function createBet(params, bearerToken, payload) {
    try{        
        let res = await fetch(`${apiUrl}/api/app/games/bet/place`, {
            method : 'POST',
            timeout: 1000*1000,
            headers : addSecurityHeader({bearerToken, payload :  payload || params.user}),
            body : JSON.stringify(params)}
        )
        return res.json();
    }catch(err){
        console.log(err);
        throw err;
    }  
}


/**
 *
 * @param {*} params
 * @param {*} bearerToken
 * @name Get Bets
 * @use Get User Bets
 */

export async function getMyBets(params, bearerToken, payload) {
    try{
        let res = await fetch(`${apiUrl}/api/users/bets`, {
            method : 'POST',
            headers : addSecurityHeader({bearerToken, payload :  payload || params.user}),
            body : JSON.stringify(params)})
        return res.json();
    }catch(err){
        throw err;
    }    
}

/**
 *
 * @param {*} params
 * @param {*} bearerToken
 * @name Create Bet
 * @use Once User wants to bet
 */


export async function updateUserWallet(params, bearerToken, payload) {
    let res = await fetch(`${apiUrl}/api/users/updateWallet`, {
        method : 'POST',
        timeout: 1000*1000,
        headers : addSecurityHeader({bearerToken, payload :  payload || params.user}),
        body : JSON.stringify(params)
    })
    return res.json();
}
  

function addSecurityHeader({bearerToken, payload}) {
  return {
        'Content-Type' : 'application/json',
        'authorization': `Bearer ${bearerToken}`,
        'payload'       : JSON.stringify({id : payload})
  };
}

/**
 *
 * @param {*} params
 * @param {*} bearerToken
 * @name Set 2FA
 * @use Once User Wants to set 2FA
 */

export async function set2FA(params, bearerToken, payload) {
    try{
        let res = await fetch(`${apiUrl}/api/users/2fa/set`, {
            method : 'POST',
            timeout: 1000*1000,
            headers : addSecurityHeader({bearerToken, payload :  payload || params.user}),
            body : JSON.stringify(params)})
        return res.json();
    }catch(err){
        throw err;
    }
}

/**
 *
 * @param {*} params
 * @param {*} bearerToken
 * @name User Auth
 * @use Get User authentication info
 */

export async function userAuth(params, bearerToken, payload) {
    try{
        let res = await fetch(`${apiUrl}/api/users/auth`, {
            method : 'POST',
            headers : addSecurityHeader({bearerToken, payload :  payload || params.user}),
            body : JSON.stringify(params)})

        let response = await res.json();

        const { message, status } = response.data;

        if(status === 48) {
            await store.dispatch(setMessageNotification(message));
            await delay(3000);
            logout();
            return null;
        }
        else if(status === 59) {
            window.location.href = getWebsite();
            return null;
        }

        return {
            address : message.address,
            status,
            balance: message.wallet.playBalance,
            id  : message.id,
            bearerToken : message.bearerToken,
            username    : message.username,
            withdraws   : message.withdraws,
            deposits    : message.deposits,
            ...message
        };

        return null;

    } catch (error) {
        return handleError(error);
    } 
}


/**
 *
 * @param {*} params
 * @param {*} bearerToken
 * @name Get Currency Address
 * @use Get Address by Currency
 */

export async function getCurrencyAddress(params, bearerToken, payload) {
    try{
        let res = await fetch(`${apiUrlWithdraw}/api/app/address/get`, {
            method : 'POST',
            headers : addSecurityHeader({bearerToken, payload :  payload || params.id}),
            body : JSON.stringify(params)})
        return res.json();
    }catch(err){
        throw err;
    }    
}

export async function getTransactions(userId, bearerToken) {
    try {
        const response = await axios.post(`${apiUrlWithdraw}/user/transactions`, {
            headers: {
                'Content-Type' : 'application/json',
                'authorization': `Bearer ${bearerToken}`,
            },
             user: userId,
             app: appId,
        });
            return console.log(response.json());

    } catch (error) {
        return handleError(error);
    }  
}

/**
 *
 * @param {*} params
 * @param {*} bearerToken
 * @name Get Jackpot
 * @use Get info about Jackpot Pot
 */

export async function getJackpotPot(params, bearerToken, payload) {
    try{
        let res = await fetch(`${apiUrl}/api/users/jackpot/pot`, {
            method : 'POST',
            headers : addSecurityHeader({bearerToken, payload :  payload || params.user}),
            body : JSON.stringify(params)})
        return res.json();
    }catch(err){
        throw err;
    }    
}

/**
 *
 * @param {*} params
 * @param {*} bearerToken
 * @name Get Token
 * @use Third-party games token
 */

export async function getProviderToken(params, bearerToken, payload) {
    try{
        let res = await fetch(`${apiUrl}/api/app/provider/token`, {
            method : 'POST',
            headers : addSecurityHeader({bearerToken, payload :  payload || params.user}),
            body : JSON.stringify(params)})
        return res.json();
    }catch(err){
        throw err;
    }    
}

export async function sendFreeCurrencyRequest(params, bearerToken, payload) {
    try{
        let res = await fetch(`${apiUrl}/api/app/freeCurrency/get`, {
            method : 'POST',
            headers : addSecurityHeader({bearerToken, payload :  payload || params.user}),
            body : JSON.stringify(params)})
        return res.json();
    }catch(err){
        throw err;
    }    
}