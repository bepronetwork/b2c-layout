import { SET_CHAT_INFO } from "../actions/chat";

const initialState = {
  messages: [],
  participants: 0,
  open: true,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CHAT_INFO:
      return action.action;
    default:
      return state;
  }
}
