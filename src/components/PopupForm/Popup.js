import React, { Component } from "react";
// eslint-disable-next-line import/no-cycle
import PropTypes from "prop-types";
import { Typography } from "components";
import EmojiEventsIcon from "@material-ui/icons/EmojiEvents";
import { setMessagePopup } from "../../redux/actions/popup";
import classNames from "classnames";
import _ from "lodash";
import "./index.css";

class Popup extends Component {
  static propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    messages: PropTypes.arrayOf(PropTypes.string),
    message: PropTypes.string,
    type: PropTypes.oneOf(["congrats"])
  };

  static defaultProps = {
    id: "",
    title: "Congratulations!",
    messages: [],
    message: "",
    type: "congrats"
  };

  componentDidMount() {
    setTimeout(this.closeWindow, 3000);
  }

  closeWindow = async () => {
    let filteredArray = this.props.messages.filter(
      item => item.id !== this.props.id
    );
    await this.props.dispatch(setMessagePopup(filteredArray));
  };

  render() {
    const id = this.props.id;
    const title = this.props.title;
    const message = this.props.message;
    const type = this.props.type;

    const popupStyles = classNames("popup", "popup-" + type);
    const iconStyles = classNames("popup-icon", "icon-" + type);
    const contentStyles = classNames("popup-content", "content-" + type);

    function PopupIcon(type) {
      switch (type) {
        case "congrats":
          return <EmojiEventsIcon size="30" color="white" styleName="icon" />;
        default:
          return null;
      }
    }

    return (
      <div styleName={popupStyles} id={id}>
        <span styleName={iconStyles}>{PopupIcon(type)}</span>
        <div styleName={contentStyles}>
          <div styleName="popup-title">
            <Typography
              variant={"small-body"}
              color={"white"}
              weight="semi-bold"
            >
              {title}
            </Typography>
          </div>
          <div styleName="popup-message">
            <Typography variant={"small-body"} color={"white"}>
              {message}
            </Typography>
          </div>
        </div>
        <div styleName="popup-close" onClick={this.closeWindow}></div>
      </div>
    );
  }
}

export default Popup;
