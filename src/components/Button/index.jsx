import React, { Component } from "react";
import PropTypes from "prop-types";

import classNames from "classnames";

import "./index.css";

export default class Button extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    theme: PropTypes.oneOf(["default", "primary", "action"]),
    type: PropTypes.oneOf(["button", "submit"]),
    fullWidth: PropTypes.bool,
    disabled: PropTypes.bool,
    children: PropTypes.node.isRequired,
    size: PropTypes.oneOf(["x-small", "small", "medium", "large"]),
    name: PropTypes.string,
    animation: PropTypes.node,
    icon: PropTypes.string
  };

  static defaultProps = {
    onClick: null,
    theme: "default",
    type: "button",
    fullWidth: false,
    disabled: false,
    size: "small",
    name: null,
    animation: null
  };

  state = {
    isAnimating: false
  };

  handleClick = event => {
    const { onClick, animation } = this.props;

    if (!animation) {
      onClick(event);
    } else {
      this.setState({ isAnimating: true }, () => {
        onClick(event);
      });
    }
  };

  handleAnimation = () => {
    this.setState({ isAnimating: false });
  };

  renderContent = () => {
    const { isAnimating } = this.state;
    const { animation, children } = this.props;

    if (!animation || !isAnimating) {
      return children;
    }

    return (
      <div>
        <div styleName="hide-children">{children}</div>
        <div onAnimationEnd={this.handleAnimation} styleName="animation">
          {animation}
        </div>
      </div>
    );
  };

  render() {
    const {
      fullWidth,
      theme,
      disabled,
      size,
      type,
      name,
      onClick,
      icon
    } = this.props;
    const rootStyles = classNames("root", {
      [theme]: true,
      fullwidth: fullWidth,
      disabled
    });

    const contentStyles = classNames("content", {
      [size]: true,
      fullwidth: fullWidth
    });
    return (
        // eslint-disable-next-line react/button-has-type
        <button
            style={this.props.style}
            styleName={rootStyles}
            onClick={onClick ? this.handleClick : null}
            type={type}
            name={name}
            disabled={disabled}
        >
            <div styleName={contentStyles}>
              {
                icon
                ?
                  <div styleName="icon">
                    {icon}
                  </div>
                :
                  null
              }
              {this.renderContent()}
            </div>
        </button>
    );
  }
}
