import React, { Component } from "react";
import PropTypes from "prop-types";
import InvitationCards from "components/Icons/InvitationCards";
import { Button, Typography } from "components";
import config from "config";
import { map } from "lodash";

import "./index.css";

export default class PlayInvitation extends Component {
  static propTypes = {
    onLoginRegister: PropTypes.func.isRequired
  };

  handleClick = () => {
    const { onLoginRegister } = this.props;

    if (onLoginRegister) onLoginRegister("register");
  };

  renderLabels = () => {
    return (
      <ul styleName="labels">
        {map(config.labels, label => {
          return (
            <li key={label}>
              <Typography weight="regular" color="casper">
                {label}
              </Typography>
            </li>
          );
        })}
      </ul>
    );
  };

  render() {
    return (
      <div styleName="root">
        <div styleName="container">
          <div styleName="invitation">
            <InvitationCards />
            <div styleName="play-button">
              <Button onClick={this.handleClick} theme="primary">
                <Typography weight="semi-bold" color="pickled-bluewood">
                  Play Now
                </Typography>
              </Button>
            </div>
          </div>
          <div styleName="labels-container">
            <Typography weight="semi-bold" color="white" variant="h4">
              {config.title}
            </Typography>
            {this.renderLabels()}
          </div>
        </div>
      </div>
    );
  }
}
