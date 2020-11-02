export const SET_2FA = "SET_2FA";

export function set2FA(data) {
  return {
    type: SET_2FA,
    action: data,
  };
}
