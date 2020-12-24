import { isEmpty, isArray } from "lodash";
import newId from "../../utils/newId";

export default function(state = {}, action) {
  switch (action.type) {
    case "SET_POPUP_MESSAGE": {
      let messages = [];

      if (!isEmpty(action.action)) {
        if (isArray(action.action)) {
          Object.values(action.action).map((text) => {
            if (!isEmpty(text.id)) {
              messages = action.action;
            } else {
              messages.push({ id: newId("popup-id-"), message: text });
            }

            return null;
          });
        } else {
          messages.push({ id: newId("popup-id-"), message: action.action });
        }
      }

      return messages;
    }
    default:
      return state;
  }
}
