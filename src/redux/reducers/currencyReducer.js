const initialState = {};

export default function (state = initialState, action) {
    switch (action.type) {
        case 'SET_DATA_CURRENCY_VIEW' :
            return action.action
      default:
        return state;
    }
  }
  