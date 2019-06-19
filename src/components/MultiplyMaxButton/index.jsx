import React, { Component } from "react";
import PropTypes from "prop-types";
import Typography from "../Typography";

import "./index.css";

export default class MultiplyMaxButton extends Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired
  };

  handleClick = event => {
    const { onSelect } = this.props;

    onSelect(event.currentTarget.name);
  };

  render() {
    return (
      <div styleName="root">
        <div styleName="container">
          <button
            name={0.5}
            onClick={this.handleClick}
            styleName="button"
            type="button"
          >
            <div styleName="button-container">
              <Typography weight="semi-bold" variant="body" color="casper">
                ½
              </Typography>
            </div>
          </button>
          <button
            name={2}
            onClick={this.handleClick}
            styleName="button"
            type="button"
          >
            <div styleName="button-container">
              <Typography weight="semi-bold" variant="body" color="casper">
                2×
              </Typography>
            </div>
          </button>
          <button
            name="max"
            onClick={this.handleClick}
            styleName="button"
            type="button"
          >
            <div styleName="button-container">
              <Typography
                weight="semi-bold"
                variant="small-body"
                color="casper"
              >
                max
              </Typography>
            </div>
          </button>
        </div>
      </div>
    );
  }
}
