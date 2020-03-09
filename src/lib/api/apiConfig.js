require('dotenv').config();

export const IS_PRODUCTION = process.env.REACT_APP_PRODUCTION;

export const appId = process.env.REACT_APP_APP_ID;

export const apiUrl = process.env.REACT_APP_API_MASTER;

export const apiUrlWithdraw = process.env.REACT_APP_API_WITHDRAW;
