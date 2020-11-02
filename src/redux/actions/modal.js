export const SET_MODAL = "SET_MODAL";

export function setModal(data) {
  return {
    type: SET_MODAL,
    action: data,
  };
}
