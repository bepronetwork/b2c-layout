import { setMessageNotification } from "../../redux/actions/message";
import store from "../../containers/App/store";
export default async function handleError(error) {
    await store.dispatch(setMessageNotification(new String(error).toString()));
    throw error;
}
