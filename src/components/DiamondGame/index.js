import React, { Component } from "react";

import Diamond from "../../assets/DiamondIcons/diamond.svg";
import DiamondFill from "../../assets/DiamondIcons/diamond-fill.svg";
import DiamondWithBorder from "../../assets/DiamondIcons/diamond-with-border.svg";

import "./index.css";

class DiamondGame extends Component {
  render() {
    return (
      <div styleName="container">
        <div>
          <div styleName="result-container">
            <div>
              <img src={DiamondFill} alt="" styleName="icon-svg" />
              <img src={DiamondFill} alt="" styleName="icon-svg" />
              <img src={DiamondFill} alt="" styleName="icon-svg" />
              <img src={DiamondFill} alt="" styleName="icon-svg" />
              <img src={DiamondFill} alt="" styleName="icon-svg" />
            </div>

            <p styleName="text-result">50,00x</p>
          </div>
          <div styleName="result-container">
            <div>
              <img src={DiamondFill} alt="" styleName="icon-svg" />
              <img src={DiamondFill} alt="" styleName="icon-svg" />
              <img src={DiamondFill} alt="" styleName="icon-svg" />
              <img src={DiamondFill} alt="" styleName="icon-svg" />
              <img src={Diamond} alt="" styleName="icon-svg" />
            </div>

            <p styleName="text-result">5,00x</p>
          </div>
          <div styleName="result-container">
            <div>
              <img src={DiamondFill} alt="" styleName="icon-svg" />
              <img src={DiamondFill} alt="" styleName="icon-svg" />
              <img src={DiamondFill} alt="" styleName="icon-svg" />
              <img src={DiamondWithBorder} alt="" styleName="icon-svg" />
              <img src={DiamondWithBorder} alt="" styleName="icon-svg" />
            </div>

            <p styleName="text-result">4,00x</p>
          </div>
          <div styleName="result-container">
            <div>
              <img src={DiamondFill} alt="" styleName="icon-svg" />
              <img src={DiamondFill} alt="" styleName="icon-svg" />
              <img src={DiamondFill} alt="" styleName="icon-svg" />
              <img src={Diamond} alt="" styleName="icon-svg" />
              <img src={Diamond} alt="" styleName="icon-svg" />
            </div>

            <p styleName="text-result">3,00x</p>
          </div>
          <div styleName="result-container">
            <div>
              <img src={DiamondFill} alt="" styleName="icon-svg" />
              <img src={DiamondFill} alt="" styleName="icon-svg" />
              <img src={DiamondWithBorder} alt="" styleName="icon-svg" />
              <img src={DiamondWithBorder} alt="" styleName="icon-svg" />
              <img src={Diamond} alt="" styleName="icon-svg" />
            </div>

            <p styleName="text-result">0,10x</p>
          </div>
          <div styleName="result-container">
            <div>
              <img src={DiamondFill} alt="" styleName="icon-svg" />
              <img src={DiamondFill} alt="" styleName="icon-svg" />
              <img src={Diamond} alt="" styleName="icon-svg" />
              <img src={Diamond} alt="" styleName="icon-svg" />
              <img src={Diamond} alt="" styleName="icon-svg" />
            </div>

            <p styleName="text-result">0,00x</p>
          </div>
          <div styleName="result-container">
            <div>
              <img src={Diamond} alt="" styleName="icon-svg" />
              <img src={Diamond} alt="" styleName="icon-svg" />
              <img src={Diamond} alt="" styleName="icon-svg" />
              <img src={Diamond} alt="" styleName="icon-svg" />
              <img src={Diamond} alt="" styleName="icon-svg" />
            </div>

            <p styleName="text-result">0,00x</p>
          </div>
        </div>
        <div styleName="container-center">
          <div styleName="second-container">
            <div styleName="bottom-base-svg" />
            <div styleName="bottom-base-svg" />
            <div styleName="bottom-base-svg" />
            <div styleName="bottom-base-svg" />
            <div styleName="bottom-base-svg" />
          </div>
        </div>
      </div>
    );
  }
}

export default DiamondGame;
