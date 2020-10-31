import React, { Component } from "react";
import { Typography, InfoIcon } from "components";
import { getIcon } from "../../lib/helpers";
import "./index.css";

export default class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  onInfoClick = () => {
    const { open } = this.state;
    this.setState({ open: !open });
  };

  render() {
    const { text } = this.props;
    const { open } = this.state;
    const infoIcon = getIcon(4);

    return (
      <div>
        {open == true
          ? [
              <span styleName="triangle"></span>,
              <div styleName="window">
                <Typography variant={"x-small-body"} color={"white"}>
                  {text}
                </Typography>
              </div>
            ]
          : null}
        <span styleName="info" onClick={() => this.onInfoClick()}>
          {infoIcon === null ? <InfoIcon /> : <img src={infoIcon} alt='Info Icon' />}
        </span>
      </div>
    );
  }
}
