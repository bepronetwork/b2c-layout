import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Typography from "../../Typography";

import "./index.css";

const tabletBreakpoint = 1267;

export default class Tab extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    selected: PropTypes.bool
  };

  static defaultProps = {
    selected: false,
    onClick: Function.prototype
  };

  handleClick = () => {
    const { name, onClick } = this.props;

    onClick(name);
  };

  isMobileOrTablet = () => {
    if (document.documentElement.clientWidth < tabletBreakpoint){
        return true;
    }
    return false;
  };

  render() {
    const { selected, label, icon } = this.props;
    const classes = classNames("tab", {
      selected
    });

    return (
      <div styleName={classes}>
        <button onClick={this.handleClick} type="button">
          {
            icon ?
              <div styleName="icon">{icon}</div>
            :
              null
          }
          <div styleName="label">
            <Typography variant={this.isMobileOrTablet() ? 'x-small-body' : 'small-body'} color="white">
              {label}
            </Typography>
          </div>
        </button>
      </div>
    );
  }
}
