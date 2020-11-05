import React, { Component } from "react";
import PropTypes from "prop-types";
import uniqueId from "lodash/uniqueId";
import classNames from "classnames";
import { CopyIcon, Typography } from "components";
import "./index.css";

export default class InputText extends Component {
  inputId = uniqueId();

  static propTypes = {
    defaultValue: PropTypes.string,
    name: PropTypes.string.isRequired,
    required: PropTypes.bool,
    label: PropTypes.string,
    onChange: PropTypes.func,
    type: PropTypes.oneOf(["text", "password"]),
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    icon: PropTypes.oneOf(["copy"]),
    maxlength: PropTypes.number,
    gutterBottom: PropTypes.bool,
    weight: PropTypes.string
  };

  static defaultProps = {
    defaultValue: null,
    required: false,
    label: null,
    onChange: null,
    type: "text",
    placeholder: "",
    disabled: false,
    icon: null,
    maxlength: "",
    gutterBottom: false,
    weight: null
  };

  state = {
    value: ""
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value !== prevState.value) {
      return { value: nextProps.value };
    }

    return null;
  }

  get icon() {
    const { icon } = this.props;

    if (!icon) return null;

    return (
      <div styleName="icon">
        <CopyIcon />
      </div>
    );
  }

  handleChange = event => {
    const { onChange } = this.props;

    if (onChange) onChange(event);

    this.setState({ value: event.target.value });
  };

  renderLabel = () => {
    const { label, weight } = this.props;

    if (!label) return null;

    return (
      <div styleName="label">
        <Typography color="casper" weight={weight || "semi-bold"}>
          {label}
        </Typography>
      </div>
    );
  };

  render() {
    const {
      name,
      placeholder,
      required,
      defaultValue,
      disabled,
      type,
      icon,
      maxlength,
      gutterBottom
    } = this.props;
    const { value } = this.state;

    const currentValue =
      defaultValue || defaultValue === "" ? defaultValue : value;

    return (
      <div styleName={classNames("root", { gutterBottom: gutterBottom })}>
        {this.renderLabel()}
        <div
          styleName={classNames("container", {
            disabled: disabled,
            "with-icon": icon
          })}
        >
          <label
            styleName={classNames("input-container", {
              "with-icon": icon
            })}
            htmlFor={this.inputId}
          >
            <div styleName="input">
              <input
                id={this.inputId}
                onChange={this.handleChange}
                name={name}
                placeholder={placeholder}
                styleName={type === "slim" ? "input-slim" : "input"}
                required={required}
                type={type}
                value={currentValue}
                disabled={disabled}
                maxLength={maxlength}
              />
            </div>
            {this.icon}
          </label>
        </div>
      </div>
    );
  }
}
