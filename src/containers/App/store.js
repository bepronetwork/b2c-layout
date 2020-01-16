import { combineReducers, createStore } from 'redux';
import {
    messageReducer,
    popupReducer,
    profileReducer,
    chatReducer,
    languageReducer,
    startLoadingProgressReducer,
    depositReducer,
    betReducer,
    withdrawReducer,
    modalReducer,
    currencyReducer
} from '../../redux/reducers/index';


const reducer = combineReducers({
    profile  : profileReducer,
    currency : currencyReducer,
    message : messageReducer,
    popup : popupReducer,
    chat : chatReducer,
    deposit : depositReducer,
    withdraw : withdrawReducer,
    language : languageReducer,
    startLoadingProgress : startLoadingProgressReducer,
    bet : betReducer,
    modal : modalReducer
});
const store = createStore(reducer);

export default store;
