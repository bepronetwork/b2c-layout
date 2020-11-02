import React, { Component } from "react";

import { Typography } from "components";

import CenterIndicator from "../../assets/icons/slideIcons/center-indicator.svg";
import { getAppCustomization } from "../../lib/helpers";
import EmptyDiamond from "../../assets/icons/slideIcons/empty";
import "./index.css";
import slideItems from "./slideItems";

export default class SliderGame extends Component {
  state = {
    primaryColor: "",
    secondaryColor: ""
  };

  componentDidMount() {
    this.getColors();
  }

  getColors = () => {
    const { colors } = getAppCustomization();

    const primaryColor = colors.find(color => {
      return color.type === "primaryColor";
    });

    const secondaryColor = colors.find(color => {
      return color.type === "secondaryColor";
    });

    this.setState({
      primaryColor: primaryColor.hex,
      secondaryColor: secondaryColor.hex
    });
  };

  render() {
    const { primaryColor, secondaryColor } = this.state;
    const { animation } = this.props;

    return (
      <div styleName="container-init">
        <div styleName="gradient-overlay" />
        <div styleName="container-row " id="container-slide">
          {slideItems.map(num => {
            return (
              <div
                styleName={
                  animation
                    ? "container-result container-animation"
                    : "container-result reset-animation"
                }
                key={num}
                id="card"
              >
                <div className="svg-container">
                  <EmptyDiamond
                    backgroundColor={primaryColor}
                    borderColor={secondaryColor}
                    height="30%"
                    width="100%"
                  />
                </div>
                <div styleName="span-style">
                  <Typography
                    variant="x-small-body"
                    weight="semi-bold"
                    color="white"
                  >
                    {`${num.value}x`}
                  </Typography>
                </div>
                <div styleName="bottom-base" />
              </div>
            );
          })}
        </div>
        <img src={CenterIndicator} alt="" styleName="indicator" />
      </div>
    );
  }
}
