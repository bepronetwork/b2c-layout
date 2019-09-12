import axios from "axios";
import handleError from "./handleError";
import { apiUrl, appId, apiUrlWithdraw, processResponse } from "./apiConfig";

// Create an instance using the config defaults provided by the library
// At this point the timeout config value is `0` as is the default for the library
const instance = axios.create();
let SEC = 200;
// Override timeout default for the library
// Now all requests using this instance will wait 2.5 seconds before timing out
instance.defaults.timeout = SEC*1000;

export async function register({ username, password, email, address }) {
    try {
        const response = await axios.post(`${apiUrl}/api/users/register`, {
            username,
            email,
            password,
            name: username,
            app: appId,
            address: address 
        });

        if (response.data.data.status !== 200) {
            return response.data.data;
        }

        const { status, message } = response.data.data;

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

        if (response.data.data.status !== 200) {
        return response.data.data;
        }
        const { status, message } = response.data.data;
        return {
            address : message.address,
            status,
            balance: message.wallet.playBalance,
            id  : message.id,
            bearerToken : message.bearerToken,
            username    : message.username,
            withdraws   : message.withdraws,
            deposits    : message.deposits
        };
    } catch (error) {
        return handleError(error);
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
  localStorage.removeItem("user");
  sessionStorage.clear();
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
