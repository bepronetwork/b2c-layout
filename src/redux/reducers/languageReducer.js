import languages from "../../config/languages";
import { SET_LANGUAGE_INFO } from "../actions/language";

const initialState = languages[0].prefix.toLowerCase();

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_LANGUAGE_INFO:
      return action.action.prefix.toLowerCase();
    default:
      return state;
  }
}
