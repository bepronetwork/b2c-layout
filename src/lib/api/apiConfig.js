require('dotenv').config();

export const IS_PRODUCTION = process.env.REACT_APP_PRODUCTION;

export const appId = process.env.REACT_APP_APP_ID;

export const apiUrl = process.env.REACT_APP_API_MASTER;

export const apiUrlWithdraw = process.env.REACT_APP_API_WITHDRAW;

export const ethNetwork = process.env.REACT_APP_ETH_NETWORK;

export const INFURA_API = process.env.REACT_APP_INFURA_API;

export const etherscanLinkID =  (ethNetwork.toLowerCase() == 'mainnet') ? `https://etherscan.io` : `https://${ethNetwork}.etherscan.io`;

export const CONFIRMATIONS_NEEDED = 7;

export const SLIPPAGE_ETH_TRADE = 0.001;

export const SLIPPAGE_ETH_PERCENTAGE = 0.05;

export const MIN_WITHDRAWAL = 5;

export const GAS_MULTIPLIER = 2;

export const GAS_AMOUNT = 100000;

