import { isEmpty, uniqueId, isArray } from "lodash";

export default function(state = {}, action) {
  switch (action.type) {
    case "SET_MESSAGE_INFO": {
      let notifications = [];

      if (!isEmpty(action.action)) {
        if (isArray(action.action)) {
          Object.values(action.action).map((text) => {
            if (!isEmpty(text.id)) {
              notifications = action.action;
            } else {
              notifications.push({
                id: uniqueId("notification-id-"),
                message: text,
              });
            }

            return null;
          });
        } else {
          notifications.push({
            id: uniqueId("notification-id-"),
            message: action.action,
          });
        }
      }

      return notifications;
    }
    default:
      return state;
  }
}
