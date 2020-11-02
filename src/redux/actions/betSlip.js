export const SET_BET_SLIP_RESULT = "SET_BET_SLIP_RESULT";
export const REMOVE_BET_SLIP_FROM_RESULT = "REMOVE_BET_SLIP_FROM_RESULT";
export const REMOVE_ALL_FROM_RESULT = "REMOVE_ALL_FROM_RESULT";

export function setBetSlipResult(data) {
  return {
    type: SET_BET_SLIP_RESULT,
    action: data,
  };
}

export function removeBetSlipFromResult(data) {
  return {
    type: REMOVE_BET_SLIP_FROM_RESULT,
    action: data,
  };
}

export function removeAllFromResult(data) {
  return {
    type: REMOVE_ALL_FROM_RESULT,
    action: data,
  };
}
