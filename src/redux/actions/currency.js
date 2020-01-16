export const SET_DATA_CURRENCY_VIEW = 'SET_DATA_CURRENCY_VIEW';

export function setCurrencyView(data) {
  return {
    type: SET_DATA_CURRENCY_VIEW,
    action : data
  };
}


