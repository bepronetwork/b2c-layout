import React, { Component } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

import { Typography } from "components";

import CenterIndicator from "../../assets/icons/slideIcons/center-indicator.svg";
import { getAppCustomization } from "../../lib/helpers";
import EmptyDiamond from "../../assets/icons/slideIcons/empty";
import GreenResult from "../../assets/icons/slideIcons/green.gif";

import "./index.css";

export default class SliderGame extends Component {
  state = {
    primaryColor: "",
    secondaryColor: ""
  };

  componentDidMount() {
    this.getColors();
  }

  changeColorValue = result => {

    if (result >= 0 && result < 2) {
      return GreenResult;
    }

    if (result >= 2 && result < 5) {
      return GreenResult;
    }

    if (result >= 5 && result < 10) {
      return GreenResult;
    }

    if (result >= 10 && result < 100) {
      return "#fea402";
    }

    if (result >= 100 && result < 1000) {
      return "#00fe16";
    }

    if (result >= 1000) {
      return "#29ebc2";
    }
  };

  changeColor = result => {

    if (result >= 0 && result < 2) {
      return "#142131";
    }

    if (result >= 2 && result < 5) {
      return "#c6c8cf";
    }

    if (result >= 5 && result < 10) {
      return "#4d21fc";
    }

    if (result >= 10 && result < 100) {
      return "#fea402";
    }

    if (result >= 100 && result < 1000) {
      return "#00fe16";
    }

    if (result >= 1000) {
      return "#29ebc2";
    }
  };

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
    const { animation, result, slideItems, timer } = this.props;

    return (
      <>
      <div styleName="container-init">
        <div styleName="gradient-overlay" />
        <div styleName="container-row " id="container-slide">
          {slideItems.map(num => {
            return (
              <div
                style={
                  animation
                    ?{
                        border: `3px solid ${this.changeColor(num.value)}`,
                        transition: "transform 10000ms cubic-bezier(0.24, 0.78, 0.15, 1) 0s ",
                        transform: "translate(-3615px, 0px)"
                      }
                      : null
                }
                styleName="container-result"
                id="card"
              >
                <div className="svg-container">
                  {result ? (
                    <EmptyDiamond
                      backgroundColor={primaryColor}
                      borderColor={this.changeColor(num.value)}
                      height="30%"
                      width="100%"
                    />
                  ) : (
                    <EmptyDiamond
                      backgroundColor={primaryColor}
                      borderColor={this.changeColor(num.value)}
                      height="30%"
                      width="100%"
                    />
                  )}
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
                <div
                  styleName="bottom-base"
                  style={{ backgroundColor: this.changeColor(num.value) }}
                />
              </div>
            );
          })}
        </div>
        <img src={CenterIndicator} alt="" styleName="indicator" />
      </div>
        <ProgressBar now={timer} min={0} max={10} />
      </>
    );
  }
}
