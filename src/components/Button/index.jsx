import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./index.css";

export default class Button extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    theme: PropTypes.oneOf(["default", "primary", "action", "link"]),
    type: PropTypes.oneOf(["button", "submit"]),
    fullWidth: PropTypes.bool,
    disabled: PropTypes.bool,
    children: PropTypes.node.isRequired,
    size: PropTypes.oneOf(["x-small", "small", "medium", "large"]),
    name: PropTypes.string,
    animation: PropTypes.node,
    icon: PropTypes.string,
    style: PropTypes.objectOf(PropTypes.string)
  };

  static defaultProps = {
    onClick: null,
    theme: "default",
    type: "button",
    fullWidth: false,
    disabled: false,
    size: "small",
    name: null,
    animation: null,
    icon: null,
    style: null
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
      <>
        <div styleName="hide-children">{children}</div>
        <div onAnimationEnd={this.handleAnimation} styleName="animation">
          {animation}
        </div>
      </>
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
      icon,
      style
    } = this.props;

    return (
      <button
        styleName={classNames("root", { [theme]: !!theme, fullWidth, disabled })}
        onClick={onClick ? this.handleClick : null}
        type={type}
        name={name}
        disabled={disabled}
        style={style}
      >
        <div styleName={classNames("content", { [size]: !!size, fullWidth })} >
          {icon ? <div styleName="icon">{icon}</div> : null}
          {this.renderContent()}
        </div>
      </button>
    );
  }
}
