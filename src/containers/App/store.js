import { combineReducers, createStore } from 'redux';
import {
    messageReducer,
    profileReducer,
    chatReducer,
    languageReducer,
    startLoadingProgressReducer,
    depositReducer,
    betReducer,
    withdrawReducer
} from '../../redux/reducers/index';


const reducer = combineReducers({
    profile  : profileReducer,
    message : messageReducer,
    chat : chatReducer,
    deposit : depositReducer,
    withdraw : withdrawReducer,
    language : languageReducer,
    startLoadingProgress : startLoadingProgressReducer,
    bet : betReducer
});
const store = createStore(reducer);

export default store;
