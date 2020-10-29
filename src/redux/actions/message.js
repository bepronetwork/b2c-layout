export const SET_MESSAGE_INFO = "SET_MESSAGE_INFO";

export function setMessageNotification(data) {
  return {
    type: SET_MESSAGE_INFO,
    action: data
  };
}
