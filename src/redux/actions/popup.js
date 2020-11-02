export const SET_POPUP_MESSAGE = "SET_POPUP_MESSAGE";

export function setMessagePopup(data) {
  return {
    type: SET_POPUP_MESSAGE,
    action: data,
  };
}
