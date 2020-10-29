import React, { Component } from "react";
// eslint-disable-next-line import/no-cycle
import PropTypes from "prop-types";
import { Typography, Button, Modal } from "components";
import UserContext from "containers/App/UserContext";
import "./index.css";
import {
  setMessageNotification,
  SET_MESSAGE_INFO
} from "../../redux/actions/message";
import { connect } from "react-redux";
import { compose } from "lodash/fp";
import _ from "lodash";
import { CopyText } from "../../copy";

class Message extends Component {
  static contextType = UserContext;

  static propTypes = {
    user: PropTypes.shape({})
  };

  state = {};

  closeWindow = async () => {
    await this.props.dispatch(setMessageNotification(null));
  };

  render() {
    let hasMessage = !_.isEmpty(this.props.message);
    if (!hasMessage) {
      return null;
    }
    let messageArray = _.isArray(this.props.message)
      ? this.props.message
      : [this.props.message];
    const { ln } = this.props;
    const copy = CopyText.messageFormMessage[ln];

    return (
      <Modal>
        <div styleName="root">
          <div styleName="title">
            {messageArray.map(text => {
              return (
                <Typography variant="h4" color="white">
                  {text}
                </Typography>
              );
            })}
            <div styleName="button">
              <Button
                name="close"
                theme="primary"
                variant="small-body"
                onClick={this.closeWindow}
              >
                <Typography>{copy.MESSAGE.TYPOGRAPHY.TEXT[0]}</Typography>
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
    message: state.message
  };
}

Message.propTypes = {
  dispatch: PropTypes.func
};

export default compose(connect(mapStateToProps))(Message);
