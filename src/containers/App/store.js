import { combineReducers, createStore } from 'redux';
import {
    messageReducer,
    profileReducer,
} from '../../redux/reducers/index';


const reducer = combineReducers({
    profile  : profileReducer,
    message : messageReducer
});
const store = createStore(reducer);

export default store;
