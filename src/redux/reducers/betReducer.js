import { SET_BET_RESULT } from "../actions/bet";

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_BET_RESULT:
      return action.action;
    default:
      return state;
  }
}
