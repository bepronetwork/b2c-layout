import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Typography from "../../Typography";
import { getAppCustomization } from "../../../lib/helpers";
import "./index.css";

const tabletBreakpoint = 1267;

export default class Tab extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    selected: PropTypes.bool,
    style: PropTypes.oneOf(["full-background", "default"])
  };

  static defaultProps = {
    selected: false,
    onClick: Function.prototype
  };

  handleClick = () => {
    const { name, onClick } = this.props;

    onClick(name);
  };

  isMobileOrTablet = () =>
    document.documentElement.clientWidth < tabletBreakpoint;

  render() {
    const { selected, label, icon, style, variant="small-body" } = this.props;
    const { skin } = getAppCustomization();
    const classes = classNames("tab", {
      selected,
      fullBackground : style === "full-background",
      fullBackgroundSelected : style === "full-background" && selected
    });

    return (
      <div styleName={classes}>
        <button onClick={this.handleClick} type="button">
          <div styleName="main">
            <div styleName="icon">
              { icon ? icon : null }
            </div>
            <div styleName="label">
              <Typography variant={this.isMobileOrTablet() ? 'x-small-body' : variant} color={skin.skin_type == "digital" ? 'secondary' : 'white'}>
                {label}
              </Typography>
            </div>
          </div>
        </button>
      </div>
    );
  }
}
