import store from "../../containers/App/store";
import { setStartLoadingProgress } from "../../redux/actions/startLoadingProgress";

export async function setStartLoadingProcessDispatcher(step){
    await store.dispatch(setStartLoadingProgress({progress : step}));
}