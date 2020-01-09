const initialState = {
    isActive : false
};


export default function (state = initialState, action) {
    switch (action.type) {
        case 'SET_2FA' :
            return {...state, ...action.action}
      default:
        return state;
    }
  }
  