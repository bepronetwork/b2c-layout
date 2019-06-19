import { setMessageNotification } from "../../redux/actions/message";
import store from "../../containers/App/store";

export const apiUrl = process.env.REACT_APP_API_URL;

export const appId = process.env.REACT_APP_APP_ID;

export async function processResponse(response){
    try{
        if(parseInt(response.data.status) != 200){
            throw new Error(response.data.message)
        }
        return response.data.message
    }catch(err){
        await store.dispatch(setMessageNotification(new String(err.message).toString()));
        throw err;
    }
}