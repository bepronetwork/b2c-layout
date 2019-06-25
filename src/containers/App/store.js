import { combineReducers, createStore } from 'redux';
import {
    messageReducer,
    profileReducer,
    chatReducer,
} from '../../redux/reducers/index';


const reducer = combineReducers({
    profile  : profileReducer,
    message : messageReducer,
    chat : chatReducer
});
const store = createStore(reducer);

export default store;
