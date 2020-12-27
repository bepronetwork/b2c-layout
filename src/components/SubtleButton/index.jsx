import React, { Component } from "react";
import PropTypes from "prop-types";
import Typography from "../Typography";
import { getAppCustomization } from "../../lib/helpers";
import "./index.css";

export default class SubtleButton extends Component {
  static propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func,
    variant: PropTypes.oneOf([
      "h1",
      "h2",
      "h3",
      "h4",
      "body",
      "small-body",
      "x-small-body"
    ]),
    name: PropTypes.string
  };

  static defaultProps = {
    children: "Subtle Link Button",
    onClick: null,
    variant: "body",
    name: null
  };

  render() {
    const { children, onClick, variant, name } = this.props;
    const skin = getAppCustomization().skin.skin_type;

    return (
      <button type="button" name={name} styleName="root" onClick={onClick}>
        <Typography color={skin === "digital" ? "secondary" : "white"} variant={variant}>
          {children}
        </Typography>
      </button>
    );
  }
}
