import {
    SET_PROFILE_INFO
} from '../actions/profile';

const initialState = {
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_PROFILE_INFO :
            return {...action.action}
      default:
        return state;
    }
  }
  