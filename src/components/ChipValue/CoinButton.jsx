import React, { Component } from "react";
import PropTypes from "prop-types";
import Coin from "components/Icons/Coin";
import classNames from "classnames";
import { Typography } from "components";
import "./CoinButton.css";

export default class CoinButton extends Component {
  static propTypes = {
    value: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
    selected: PropTypes.bool,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    selected: false,
    disabled: false,
  };

  handleSelect = () => {
    const { value, onSelect, disabled } = this.props;

    if (!disabled) {
      onSelect(value);
    }
  };

  render() {
    const { value, label, selected, disabled } = this.props;

    const containerClasses = classNames("container", {
      disabled,
      selected,
    });

    return (
      <button
        onClick={this.handleSelect}
        name={value}
        type="button"
        styleName="root"
      >
        <div styleName={containerClasses}>
          <Coin value={label} />
        </div>
        <div styleName="value">
          <Typography
            weight="semi-bold"
            variant="x-small-body"
            color="gable-green"
          >
            {value > 100 ? label : value}
          </Typography>
        </div>
      </button>
    );
  }
}
