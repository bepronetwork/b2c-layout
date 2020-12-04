import React, { Component } from "react";
import PropTypes from "prop-types";
import { Typography } from "components";
import AlertCircleIcon from 'mdi-react/AlertCircleIcon';
import CheckCircleIcon from 'mdi-react/CheckCircleIcon';
import CloseCircleIcon from 'mdi-react/CloseCircleIcon';
import { setMessageNotification } from "../../redux/actions/message";
import classNames from "classnames";
import "./index.css";

class Notification extends Component {

    static propTypes = {
        id: PropTypes.string,
        title: PropTypes.string,
        messages: PropTypes.arrayOf(PropTypes.string),
        message: PropTypes.string,
        type: PropTypes.oneOf(["success","info","error"])
    };
  
    static defaultProps = {
        id: "",
        title: "Info!",
        messages: [],
        message: "",
        type: "info"
    };

    componentDidMount(){
        setTimeout(this.closeWindow, 10000);
    }
    
    closeWindow = async () => {
        let filteredArray = this.props.messages.filter(item => item.id !== this.props.id)
        await this.props.dispatch(setMessageNotification(filteredArray));
    }

    render() {
        const id = this.props.id;
        const title = this.props.title;
        const message = this.props.message;
        const type = this.props.type;
        
        const notificationStyles = classNames("notification", "notification-" + type);
        const iconStyles = classNames("notification-icon", "icon-" + type);
        const contentStyles = classNames("notification-content", "content-" + type);

        function NotificationIcon(type) {
            switch(type) {
              case 'info':
                return <AlertCircleIcon size="30" color="white" styleName="icon"/>;
              case 'success':
                return <CheckCircleIcon size="30" color="white" styleName="icon"/>;
              case 'error':
                return <CloseCircleIcon size="30" color="white" styleName="icon"/>;
              default:
                return null;
            }
          }
        
        return (
            <div styleName={notificationStyles} id={id}>
                <span styleName={iconStyles}>
                    {NotificationIcon(type)}
                </span>
                <div styleName={contentStyles}>
                        <div styleName="notification-title">
                            <Typography variant={'small-body'} color={'white'} weight="semi-bold">
                                {title}
                            </Typography>
                        </div>
                        <div styleName="notification-message">
                            <Typography variant={'small-body'} color={'white'}>
                                {message}
                            </Typography>
                        </div>
                </div>
                <div styleName="notification-close" onClick={this.closeWindow}></div>
            </div>
        );
    }
}

export default Notification;
