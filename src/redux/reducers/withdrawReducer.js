import {
    SET_WITHDRAW_INFO
} from '../actions/withdraw';

const initialState = {
    currency : '',
    amount : 0,
    neededTrade : false,
    confirmations : 0,
    tx : null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_WITHDRAW_INFO :
            return {...state, [action.action.key] : action.action.value}
      default:
        return state;
    }
  }
  