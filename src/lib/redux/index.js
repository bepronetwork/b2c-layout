import store from "../../containers/App/store";
import { setStartLoadingProgress } from "../../redux/actions/startLoadingProgress";
import { setMessagePopup } from "../../redux/actions/popup";

export async function setStartLoadingProcessDispatcher(step){
    await store.dispatch(setStartLoadingProgress({progress : step}));
}

export async function setWonPopupMessageDispatcher(winAmount){
    const state = store.getState();
    const ticker = state.currency ? state.currency.ticker : null;
    const amountToShow = (function(ticker) {
        switch(ticker) {
            case 'ETH':
                return 1;
            case 'BTC':
                return 0.1;
            case 'Gold':
                return 1000;
            default:
                return 30;
        }
    });
    
    if (winAmount > amountToShow(ticker)) {
        await store.dispatch(setMessagePopup(new String(`You won  ${winAmount} ${ticker}!`).toString()));
    }
}
