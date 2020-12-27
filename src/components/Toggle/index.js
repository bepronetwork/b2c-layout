import React from "react";
import { Typography } from "components";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import classNames from "classnames";
import { getAppCustomization } from "../../lib/helpers";
import "./index.css";

class Toggle extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { checked, id, disabled, onChange, showText = true } = this.props;
    const skin = getAppCustomization().skin.skin_type;

    const stylesOn = classNames("toggle", {
      toggleOn: checked && skin === "digital",
      toggleOff: !checked && skin === "digital",
    });
    const stylesTextOff = classNames("toggle-text", {
      tOff: !checked,
    });
    const stylesTextOn = classNames("toggle-text", {
      tOn: checked,
    });

    return (
      <div styleName={stylesOn}>
        {showText === true ? (
          <div styleName={stylesTextOff}>
            <Typography
              variant={"x-small-body"}
              color={"fixedwhite"}
              weight={"semi-bold"}
            >
              {skin === "digital" ? "OFF" : checked === true ? "ON" : "OFF"}
            </Typography>
          </div>
        ) : (
          <div />
        )}
        <BootstrapSwitchButton
          checked={checked}
          id={id}
          onChange={onChange ? onChange : null}
          onstyle="dark"
          offstyle="secondary"
          size="xs"
          width={6}
          onlabel=" "
          offlabel=" "
          disabled={disabled === true ? true : false}
        />
        {skin === "digital" && showText === true ? (
          <div styleName={stylesTextOn}>
            <Typography
              variant={"x-small-body"}
              color={"fixedwhite"}
              weight={"semi-bold"}
            >
              {"ON"}
            </Typography>
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }
}

export default Toggle;
