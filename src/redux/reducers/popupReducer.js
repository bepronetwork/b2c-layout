import {
    SET_MESSAGE_INFO
} from '../actions/message';
import newId from '../../utils/newId';
import _ from 'lodash';


const initialState = {
};

export default function (state = initialState, action) {
    switch (action.type) {
        case 'SET_POPUP_MESSAGE' : {
            let messages = [];
            if (!_.isEmpty(action.action)) {
                (_.isArray(action.action)) ?
                    Object.values(action.action).map(text => {
                        (!_.isEmpty(text.id)) ? messages = action.action : messages.push({id: newId('popup-id-'), message: text});
                    })
                : messages.push({id: newId('popup-id-'), message: action.action}); 
            }
            return messages;
        };
        default: {
            return state;
        };
    }
  }
  