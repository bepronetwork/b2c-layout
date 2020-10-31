import React, { Component } from "react";
import coins from "assets/coins.png";
import "./index.css";

export default class CoinFlip extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <img src={coins} styleName={"coinflip-icon"} alt='Bitcoin Icon' />;
  }
}
