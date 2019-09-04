import { setMessageNotification } from "../../redux/actions/message";
import store from "../../containers/App/store";

export const IS_PRODUCTION = process.env.REACT_APP_PRODUCTION;

export const appId = process.env.REACT_APP_APP_ID;

export const apiUrl = process.env.REACT_APP_API_URL;

export const sendbirdAppID = process.env.REACT_APP_SENDBIRD_APP_ID;

export const sendbirdChannelID = process.env.REACT_APP_SENDBIRD_CHANNEL_ID;

export const ethNetwork = process.env.REACT_APP_ETH_NETWORK;

export const etherscanLinkID = `https://${ethNetwork}.etherscan.io`;


export async function processResponse(response){
    console.log(response)
    try{
        if(parseInt(response.data.status) != 200){
            let { message } = response.data;
            if(!message){message = 'Technical Issues'}
            throw new Error(message)
        }
        return response.data.message
    }catch(err){
        await store.dispatch(setMessageNotification(new String(err.message).toString()));
        throw err;
    }
}
