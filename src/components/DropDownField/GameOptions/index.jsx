import React, { Component } from "react";
import PropTypes from "prop-types";
import { uniqueId, isEmpty } from "lodash";
import classNames from "classnames";
import {
  Typography,
  RotateIcon,
  CrossIcon,
  InfiniteIcon
} from "components";

import "./index.css";

export default class DropDownGameOptionsField extends Component {
  static propTypes = {
    title: PropTypes.string,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.number,
    precision: PropTypes.number,
    icon: PropTypes.oneOf(["rotate", "bitcoin", "cross", "infinite"]),
    disabled: PropTypes.bool,
    options: PropTypes.oneOfType([PropTypes.string]),
  };

  static defaultProps = {
    step: 1,
    precision: 0,
    onChange: null,
    title: "",
    icon: null,
    disabled: false,
    value: 0,
    options: null
  };

  inputId = uniqueId();

  constructor(props) {
    super(props);

    this.state = {
      focused: false,
      value: props.value
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value !== prevState.value) {
      return { value: nextProps.value };
    }

    return null;
  }

  renderTitle = () => {
    const { title } = this.props;

    if (!title) {
      return null;
    }

    return (
      <div styleName="title">
        <Typography weight="semi-bold" variant="small-body" color="casper">
          {title}
        </Typography>
      </div>
    );
  };

  render() {
    const {
      name,
      precision,
      step,
      disabled,
      icon
    } = this.props;
    const { focused, value } = this.state;

    const inputClasses = classNames("input-container", {
      "is-focused": focused,
      disabled: disabled === true,
      "with-icon": icon
    });

    const parsedValue =
      precision > 0 ? Number(value).toFixed(precision) : value;

    return (
      <div styleName="root">
        {this.renderTitle()}
        <div styleName="container">
          <label styleName={inputClasses} htmlFor={this.inputId}>
            <select
              id={this.inputId}
              name={name}
              styleName="input"
              type="number"
              value={focused ? value : parsedValue}
              step={step}
              disabled={disabled}
            >
              
              {this.props.options.map(option => (
                  <option>{` ${option}`}</option>

              ))}
            </select>
          </label>
        </div>
      </div>
    );
  }
}
