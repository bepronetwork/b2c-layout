import React, { Component } from "react";
import PropTypes from "prop-types";
import uniqueId from "lodash/uniqueId";
import classNames from "classnames";
import { CopyIcon, Typography } from "components";
import "./index.css";

export default class InputText extends Component {
  static propTypes = {
    defaultValue: PropTypes.string,
    name: PropTypes.string.isRequired,
    required: PropTypes.bool,
    label: PropTypes.string,
    onChange: PropTypes.func,
    type: PropTypes.oneOf(["text", "password", "slim"]),
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    icon: PropTypes.oneOf(["copy"]),
    maxLength: PropTypes.number
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
    maxLength: 0
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

  inputId = uniqueId();

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
        const { label } = this.props;

        if (!label) return null;

        return (
        <div styleName="label">
            <Typography color="casper" weight={this.props.weight ? this.props.weight : "semi-bold"}>
            {label}
            </Typography>
        </div>
        );
    };

  render() {
    const {
      label,
      name,
      placeholder,
      required,
      defaultValue,
      disabled,
      type,
      icon,
      maxLength
    } = this.props;
    const { value } = this.state;

    const currentValue =
      defaultValue || defaultValue === "" ? defaultValue : value;

    const containerClasses = classNames("container", {
      disabled: disabled === true,
      "with-icon": icon
    });

    const inputContainerClasses = classNames("input-container", {
      "with-icon": icon
    });

    return (
      <div styleName="root">
        {this.renderLabel()}
        <div styleName={containerClasses}>
          <label styleName={inputContainerClasses} htmlFor={this.inputId}>
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
                maxLength={maxLength}
              />
            </div>
            {this.icon}
          </label>
        </div>
      </div>
    );
  }
}
