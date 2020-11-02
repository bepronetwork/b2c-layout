import _ from "lodash";
import {
  SET_BET_SLIP_RESULT,
  REMOVE_BET_SLIP_FROM_RESULT,
  REMOVE_ALL_FROM_RESULT,
} from "../actions/betSlip";

const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_BET_SLIP_RESULT: {
      let betSlip = [];
      if (!_.isEmpty(action.action)) {
        _.isArray(action.action)
          ? Object.values(action.action).map((bet) => {
              !_.isEmpty(bet.id)
                ? (betSlip = action.action)
                : betSlip.push(bet);
            })
          : betSlip.push(action.action);
      }

      return betSlip;
    }
    case REMOVE_BET_SLIP_FROM_RESULT: {
      const id = action.action;
      state = !_.isEmpty(state) ? state.filter((bet) => bet.id !== id) : state;
      return state;
    }
    case REMOVE_ALL_FROM_RESULT: {
      return null;
    }
    default: {
      return state;
    }
  }
}
