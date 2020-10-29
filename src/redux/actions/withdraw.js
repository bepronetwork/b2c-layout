export const SET_WITHDRAW_INFO = "SET_WITHDRAW_INFO";

export function setWithdrawInfo(data) {
  return {
    type: SET_WITHDRAW_INFO,
    action: data
  };
}
