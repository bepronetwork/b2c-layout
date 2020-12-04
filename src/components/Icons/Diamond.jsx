import React, { Component } from "react";
import PropTypes from "prop-types";
import { getAppCustomization } from "../../lib/helpers";
import "./diamond.css";

export default class Diamond extends Component {
  static propTypes = {
    result: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    roll: PropTypes.oneOf(["under", "over"]).isRequired
  };

  render() {
    const { result, roll, value } = this.props;
    let color1 = "#d4d7d7";
    let color2 = "#c8c8c8";
    let color3 = "#b0b0b0";

    if (getAppCustomization().theme === "dark") {
      color1 = "#fff";
      color2 = "#e9f0f5";
      color3 = "#d3dee6";
    }

    return (
      <div styleName="root">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45.55 51.32">
          <g id="games">
            <path
              fill={color1}
              d="M43.28,11.13,25.05.61a4.56,4.56,0,0,0-4.55,0L2.28,11.13A4.55,4.55,0,0,0,0,15.07v21a4.55,4.55,0,0,0,2.28,3.94L20.5,50.58a4.56,4.56,0,0,0,4.55,0L43.28,40.06a4.56,4.56,0,0,0,2.27-3.94v-21A4.56,4.56,0,0,0,43.28,11.13Z"
            />
            <path
              fill={color2}
              d="M21.13,24.64,1.85,13.51A1.23,1.23,0,0,0,0,14.57v22a3.69,3.69,0,0,0,1.84,3.19l19.09,11a3.69,3.69,0,0,0,1.85.49,34.48,34.48,0,0,0,0-23.82A3.3,3.3,0,0,0,21.13,24.64Z"
            />
            <path
              fill={color3}
              d="M43.7,13.51,24.42,24.64a3.3,3.3,0,0,0-1.64,2.86V51.32a3.68,3.68,0,0,0,1.84-.49l19.09-11a3.69,3.69,0,0,0,1.84-3.19v-22A1.23,1.23,0,0,0,43.7,13.51Z"
            />
          </g>
          <text
            styleName={
              (result >= value && roll === "over") ||
              (result < value && roll === "under")
                ? "green"
                : "red"
            }
            textAnchor="middle"
            x="22"
            y="30"
          >
            {result}
          </text>
        </svg>
      </div>
    );
  }
}
