import React, { Component } from "react";
import roulette from "assets/roulette.png";
import "./index.css";

export default class Roulette extends Component {
  render() {
    return <img src={roulette} styleName={"roulette-icon"} alt='Roulette Icon' />;
  }
}
