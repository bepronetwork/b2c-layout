const initialState = {

};

export default function (state = initialState, action) {
    switch (action.type) {
        case 'SET_MODAL' :
            return {...state, [action.action.key] : action.action.value};
      default:
        return state;
    }
  }
  