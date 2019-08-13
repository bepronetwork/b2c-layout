import {
    SET_DEPOSIT_OR_WITHDRAW_RESULT
} from '../actions/depositOrWithdraw';

const initialState = { }

export default function (state = initialState, action) {
    const object = action.action;
    switch (action.type) {
        case SET_DEPOSIT_OR_WITHDRAW_RESULT :
            return {...object, id : object.transactionHash ? object.transactionHash : object.nonce};
      default:
        return state;
    }
  }
  