import { combineReducers, createStore } from 'redux';
import {
    messageReducer,
    profileReducer,
    depositOrWithdrawReducer,
    chatReducer,
    languageReducer,
    betReducer
} from '../../redux/reducers/index';


const reducer = combineReducers({
    profile  : profileReducer,
    message : messageReducer,
    chat : chatReducer,
    language : languageReducer,
    depositOrWithdraw : depositOrWithdrawReducer,
    bet : betReducer
});
const store = createStore(reducer);

export default store;
