import newId from '../../utils/newId';
import _ from 'lodash';


const initialState = {
};

export default function (state = initialState, action) {
    switch (action.type) {
        case 'SET_MESSAGE_INFO' : {
            let notifications = [];
            if (!_.isEmpty(action.action)) {
                (_.isArray(action.action)) ?
                    Object.values(action.action).map(text => {
                        (!_.isEmpty(text.id)) ? notifications = action.action : notifications.push({id: newId('notification-id-'), message: text});
                    })
                : notifications.push({id: newId('notification-id-'), message: action.action}); 
            }
            return notifications;
        };
        default: {
            return state;
        };
    }
  }
  