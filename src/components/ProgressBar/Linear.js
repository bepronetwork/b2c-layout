import React, { Component } from "react";
import { Line } from "rc-progress";
import "./index.css";

class ProgressBarLinear extends Component {
  constructor() {
    super();
  }

  render() {
    const { progress } = this.props;
    return (
      <div>
        <div styleName="line">
          <Line
            percent={progress}
            gapPosition="right"
            strokeWidth="6"
            strokeLinecap="round"
            strokeColor={"white"}
          />
        </div>
      </div>
    );
  }
}

export default ProgressBarLinear;
