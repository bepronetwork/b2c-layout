import axios from "axios";
import handleError from "./handleError";
import { apiUrl, appId, processResponse } from "./apiConfig";

// Create an instance using the config defaults provided by the library
// At this point the timeout config value is `0` as is the default for the library
const instance = axios.create();
let SEC = 200;
// Override timeout default for the library
// Now all requests using this instance will wait 2.5 seconds before timing out
instance.defaults.timeout = SEC*1000;

export async function register({ username, password, email, address }) {
  try {
    const response = await axios.post(`${apiUrl}/users/register`, {
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
    const response = await axios.post(`${apiUrl}/users/login`, {
      username,
      password
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
        console.log(user);
        const response = await axios.post(`${apiUrl}/users/summary`, {
            user: user.id,
            type: "WALLET"
        });

        console.log(response);

        const newUser = {
        ...user,
        balance: response.data.data.message["0"].playBalance
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

export async function requestWithdraw(params, bearerToken) {
    console.log(params)
    try{
        let res = await fetch(`${apiUrl}/users/requestWithdraw`, {
            method : 'POST',
            timeout: 1000*1000,
            headers : addSecurityHeader(bearerToken),
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

export async function cancelWithdraw(params, bearerToken) {
    try{
        let res = await fetch(`${apiUrl}/users/cancelWithdraw`, {
            method : 'POST',
            headers : addSecurityHeader(bearerToken),
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

export async function finalizeWithdraw(params, bearerToken) {
    try{
        let res = await fetch(`${apiUrl}/users/finalizeWithdraw`, {
            method : 'POST',
            timeout: 1000*1000,
            headers : addSecurityHeader(bearerToken),
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

export async function createBet(params, bearerToken) {
    try{
        let res = await axios.post(`${apiUrl}/app/games/bet/place`, params, addSecurityHeader(bearerToken))
        return res.data;
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


export async function updateUserWallet(params, bearerToken) {
    return axios
      .post(
        `${apiUrl}/users/updateWallet`,
        params,
        addSecurityHeader(bearerToken)
      )
      .then(res => {
        return res.data;
      })
      .catch(error => {
        throw error;
      });
  }
  

function addSecurityHeader(bearerToken) {
  return {
        'Content-Type' : 'application/json',
        authorization: `Bearer ${bearerToken}`
  };
}
