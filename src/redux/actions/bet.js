export const SET_BET_RESULT = "SET_BET_RESULT";

export function setBetResult(data) {
  return {
    type: SET_BET_RESULT,
    action: data,
  };
}
