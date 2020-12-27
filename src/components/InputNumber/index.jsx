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

export default class InputNumber extends Component {
  static propTypes = {
    title: PropTypes.string,
    max: PropTypes.number,
    min: PropTypes.number,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    unit: PropTypes.string,
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.number,
    precision: PropTypes.number,
    icon: PropTypes.oneOf(["rotate", "bitcoin", "cross", "infinite", "customized"]),
    disabled: PropTypes.bool,
    custmomizedIcon: PropTypes.string
  };

  static defaultProps = {
    step: 1,
    precision: 0,
    unit: "",
    onChange: null,
    min: 0,
    max: 100,
    title: "",
    icon: null,
    disabled: false,
    value: 0,
    custmomizedIcon: null
  };

  inputId = uniqueId();

  constructor(props) {
    super(props);

    this.state = {
      focused: false,
      value: props.value || props.min
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value !== prevState.value) {
      return { value: nextProps.value };
    }

    return null;
  }

  get unit() {
    const { unit, icon, custmomizedIcon } = this.props;

    if (!unit && !icon) return null;

    switch (icon) {
        case "rotate":
            return (
            <div styleName="icon">
                <RotateIcon />
            </div>
            );
        case "bitcoin":
            return null;
        case "cross":
            return (
            <div styleName="icon">
                <CrossIcon />
            </div>
            );
        case "infinite":
            return (
            <div styleName="icon">
                <InfiniteIcon />
            </div>
            );
        case "customized":
            return (
            <div styleName="icon">
                <img src={custmomizedIcon} width={20} alt="Custom" />
            </div>
            );
        default:
    }

    return (
      <span styleName="unit">
        <Typography variant="small-body" color="white">
          {unit}
        </Typography>
      </span>
    );
  }

  handleChange = event => {
    const { onChange, max, type } = this.props;
    let value = event.target.value;

    if (type === "currency") {
      var regex = /^(\d+(?:[\.\,]\d{0,6})?)$/;
      if (value && !regex.test(value)) { return "" };

      value = value.replace(",", ".");
    }
    else {
      value = Number(value);
    }

    if (isEmpty(event.target.value) || event.target.value < 0) {
      this.setState({ value: "" });

      return onChange("");
    }

    const newValue = max && value > max ? max : value;

    if (onChange) onChange(newValue);

    return this.setState({ value: newValue });
  };

  handleBlur = () => {
    const { min, onChange } = this.props;
    const { focused, value } = this.state;

    if (focused && value < min) {
      this.setState({ focused: false, value: min });
      onChange(min);
    }

    this.setState({ focused: false });
  };

  handleFocus = () => {
    this.setState({ focused: true });
  };

  handleWheel = event => {
    const { focused } = this.state;

    if (focused) event.preventDefault();
  };

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
      min,
      max,
      precision,
      step,
      disabled,
      icon,
      unit,
      type
    } = this.props;
    const { focused, value } = this.state;

    const inputClasses = classNames("input-container", {
      "is-focused": focused,
      disabled: disabled === true,
      "with-icon": icon || unit
    });

    const parsedValue =
      precision > 0 ? Number(value) : value;

    return (
      <div styleName="root">
        {this.renderTitle()}
        <div styleName="container">
          <label styleName={inputClasses} htmlFor={this.inputId}>
            <input
              id={this.inputId}
              name={name}
              min={min}
              max={max}
              onBlur={this.handleBlur}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
              onWheel={this.handleWheel}
              styleName="input"
              type={type === "currency" ? "text" : "number"}
              value={focused ? value : parsedValue}
              step={step}
              disabled={disabled}
            />
            {this.unit}
          </label>
        </div>
      </div>
    );
  }
}
