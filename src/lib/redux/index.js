import store from "../../containers/App/store";
import { setStartLoadingProgress } from "../../redux/actions/startLoadingProgress";
import { setMessagePopup } from "../../redux/actions/popup";

export async function setStartLoadingProcessDispatcher(step){
    await store.dispatch(setStartLoadingProgress({progress : step}));
}

export async function setWonPopupMessageDispatcher(winAmount){
    if (winAmount > 30) {
        await store.dispatch(setMessagePopup(new String("You won " + winAmount + "!").toString()));
    }
}
