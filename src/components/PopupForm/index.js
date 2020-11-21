import React, { Component } from "react";
import Popup from './Popup';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import { isArray, isEmpty } from 'lodash';
import "./index.css";

class PopupForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            notification: {},
            hasNotification: false
        };
    }

    componentDidMount() {
        this.projectData(this.props);
    }

    projectData = props => {
        const { popup } = props;
        const notification = isArray(popup) ? popup : [popup];
        const hasNotification = !isEmpty(popup);

        this.setState({ notification, hasNotification });
    }

    render() {
        const { notification, hasNotification } = this.state;
        const { id, title, message, type } = notification;

        // let hasNotification = !_.isEmpty(this.props.popup);

        if (!hasNotification) {
            return null;
        };

        //         let notificationArray = _.isArray(this.props.popup) ? this.props.popup : [this.props.popup];
        //         const {ln} = this.props;
        // const copy = CopyText.popupFormIndex[ln];
        //         console.log(notificationArray, 'notificationArray');

        return (
            <div styleName="popup-container">
                <div styleName="popup-wrapper">
                    <Popup
                        id={id}
                        title={title}
                        message={message} 
                        type={type} 
                        messages={notification}
                        {...this.props}
                    />
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