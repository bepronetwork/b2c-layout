export const SET_DEPOSIT_INFO = "SET_DEPOSIT_INFO";

export function setDepositInfo(data) {
  return {
    type: SET_DEPOSIT_INFO,
    action: data
  };
}
