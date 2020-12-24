import { isEmpty, isArray } from "lodash";
import {
  SET_BET_SLIP_RESULT,
  REMOVE_BET_SLIP_FROM_RESULT,
  REMOVE_ALL_FROM_RESULT,
} from "../actions/betSlip";

export default function(state = {}, action) {
  switch (action.type) {
    case SET_BET_SLIP_RESULT: {
      let betSlip = [];

      if (!isEmpty(action.action)) {
        if (isArray(action.action)) {
          Object.values(action.action).map((bet) => {
            if (!isEmpty(bet.id)) {
              betSlip = action.action;
            } else {
              betSlip.push(bet);
            }

            return null;
          });
        } else {
          betSlip.push(action.action);
        }
      }

      return betSlip;
    }
    case REMOVE_BET_SLIP_FROM_RESULT: {
      const id = action.action;
      const reassignedState = !isEmpty(state)
        ? state.filter((bet) => bet.id !== id)
        : state;

      return reassignedState;
    }
    case REMOVE_ALL_FROM_RESULT: {
      return null;
    }
    default: {
      return state;
    }
  }
}
