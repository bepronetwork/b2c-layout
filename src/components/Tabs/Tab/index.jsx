import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Typography from "../../Typography";

import "./index.css";

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

  render() {
    const { selected, label } = this.props;
    const classes = classNames("root", {
      selected
    });

    return (
      <button styleName={classes} onClick={this.handleClick} type="button">
        <Typography variant="body" color="white">
          {label}
        </Typography>
        {selected ? <div styleName="selected-underline" /> : null}
      </button>
    );
  }
}
