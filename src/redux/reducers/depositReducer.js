import {
    SET_DEPOSIT_INFO
} from '../actions/deposit';

const initialState = {
    currency : '',
    amount : 0,
    neededTrade : false,
    confirmations : 0,
    tx : null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_DEPOSIT_INFO :
            return {...state, [action.action.key] : action.action.value}
      default:
        return state;
    }
  }
  