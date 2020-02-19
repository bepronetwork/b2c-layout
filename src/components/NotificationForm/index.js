import React, { Component } from "react";
import Notification from './Notification';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from 'lodash/fp'
import _ from 'lodash';
import "./index.css";
import { CopyText } from '../../copy';

class NotificationForm extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    static propTypes = {
        user: PropTypes.shape({})
    };

    handleTabChange = name => {
        this.setState({ tab: name });
    };

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
        profile: state.profile,
        message : state.message
    };
}

NotificationForm.propTypes = {
    dispatch: PropTypes.func
};

export default compose(connect(mapStateToProps))(NotificationForm);