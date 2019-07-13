import { combineReducers, createStore } from 'redux';
import {
    messageReducer,
    profileReducer,
    chatReducer,
    languageReducer
} from '../../redux/reducers/index';


const reducer = combineReducers({
    profile  : profileReducer,
    message : messageReducer,
    chat : chatReducer,
    language : languageReducer
});
const store = createStore(reducer);

export default store;
