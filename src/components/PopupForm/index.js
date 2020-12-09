import React, { Component } from "react";
import Popup from './Popup';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from 'lodash/fp'
import _ from 'lodash';
import "./index.css";

class PopupForm extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    static propTypes = {
        user: PropTypes.shape({})
    };

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
        profile: state.profile,
        popup : state.popup
    };
}

PopupForm.propTypes = {
    dispatch: PropTypes.func
};

export default compose(connect(mapStateToProps))(PopupForm);