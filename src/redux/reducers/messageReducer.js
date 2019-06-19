import {
    SET_MESSAGE_INFO
} from '../actions/message';


const initialState = {
};

export default function (state = initialState, action) {
    switch (action.type) {
        case 'SET_MESSAGE_INFO' :
            return action.action;
      default:
        return state;
    }
  }
  