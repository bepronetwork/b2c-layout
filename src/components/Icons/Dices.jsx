import React, { Component } from "react";
import dices from "assets/dices.png";

import "./index.css";

export default class Dices extends Component {
  render() {
    return <img src={dices} styleName={"dice-icon"} />;
  }
}
