import React, { Component } from "react";
import Notification from './Notification';
import { connect } from "react-redux";
import { compose } from 'lodash/fp'
import _ from 'lodash';
import "./index.css";

class NotificationForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let hasNotification = !_.isEmpty(this.props.message);
        if(!hasNotification){return null};
        let notificationArray = _.isArray(this.props.message) ? this.props.message : [this.props.message];

        return (
            <div styleName="notify-container">
                <div styleName="notify-wrapper">
                    {notificationArray.map( notification => {
                        return (
                            <Notification {...this.props} id={notification.id} title={notification.title} message={notification.message} type={notification.type} messages={notificationArray}/> 
                        );
                    })}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        message : state.message
    };
}

export default compose(connect(mapStateToProps))(NotificationForm);