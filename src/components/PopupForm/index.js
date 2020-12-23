import React, { Component } from "react";
import Popup from './Popup';
import { connect } from "react-redux";
import { compose } from 'lodash/fp'
import _ from 'lodash';
import "./index.css";

class PopupForm extends Component {
    render() {
        let hasNotification = !_.isEmpty(this.props.popup);
        if(!hasNotification){return null};
        let notificationArray = _.isArray(this.props.popup) ? this.props.popup : [this.props.popup];

        return (
            <div styleName="popup-container">
                <div styleName="popup-wrapper">
                    {notificationArray.map( notification => {
                        return (
                            <Popup {...this.props} id={notification.id} title={notification.title} message={notification.message} type={notification.type} messages={notificationArray}/> 
                        );
                    })}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        popup : state.popup
    };
}

export default compose(connect(mapStateToProps))(PopupForm);