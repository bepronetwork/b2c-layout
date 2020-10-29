import React, { Component } from "react";
import { Circle } from "rc-progress";
import "./index.css";

class ProgressBarCircular extends Component {
  constructor() {
    super();
  }

  changeState() {}

  render() {
    const { progress } = this.props;
    return (
      <div>
        <div styleName="circular">
          <Circle
            percent={progress}
            gapDegree={100}
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

export default ProgressBarCircular;
