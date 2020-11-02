import { SET_START_LOADING_PROGRESS } from "../actions/startLoadingProgress";

const initialState = {
  confirmations: 6,
  progress: 0,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_START_LOADING_PROGRESS:
      return { ...state, ...action.action };
    default:
      return state;
  }
}
