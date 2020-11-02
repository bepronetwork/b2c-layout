export const SET_LANGUAGE_INFO = "SET_LANGUAGE_INFO";

export function setLanguageInfo(data) {
  return {
    type: SET_LANGUAGE_INFO,
    action: data,
  };
}
