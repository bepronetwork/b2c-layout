require("dotenv").config();

export const IS_PRODUCTION = process.env.REACT_APP_PRODUCTION;

export const appId = process.env.REACT_APP_APP_ID;

export const apiUrl = process.env.REACT_APP_API_MASTER;

export const apiUrlWithdraw = process.env.REACT_APP_API_WITHDRAW;

export const apiUrlEsports = process.env.REACT_APP_API_ESPORTS;

export const websocketUrlEsports = process.env.REACT_APP_WEBSOCKET_ESPORTS;
