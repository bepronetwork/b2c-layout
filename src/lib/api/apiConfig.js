require('dotenv').config();

export const IS_PRODUCTION = process.env.REACT_APP_PRODUCTION;

export const appId = process.env.REACT_APP_APP_ID;

export const apiUrl = process.env.REACT_APP_API_MASTER;

export const apiUrlWithdraw = process.env.REACT_APP_API_WITHDRAW;

export const ethNetwork = process.env.REACT_APP_ETH_NETWORK;

export const INFURA_API = process.env.REACT_APP_INFURA_API;

export const etherscanLinkID =  (ethNetwork.toLowerCase() == 'mainnet') ? `https://etherscan.io` : `https://${ethNetwork}.etherscan.io`;

export const MIN_WITHDRAWAL = 0.001;

