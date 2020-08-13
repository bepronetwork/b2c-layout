import React, { Component } from "react";

import Diamond from "../../assets/DiamondIcons/diamond";
import DiamondFill from "../../assets/DiamondIcons/diamond-fill";
import DiamondWithBorder from "../../assets/DiamondIcons/diamond-with-border";

import hexagonDiamond from "../../assets/DiamondIcons/hexagon-diamond.svg";
import octagonDiamond from "../../assets/DiamondIcons/octagon-diamond.svg";
import pentagonDiamond from "../../assets/DiamondIcons/pentagon-diamond.svg";
import quadrilateralDiamond from "../../assets/DiamondIcons/quadrilateral-diamond.svg";
import quadrilateralDiamondGreen from "../../assets/DiamondIcons/quadrilateral-diamond-green.svg";

import "./index.css";

class DiamondGame extends Component {
  state = {
    isHover: false,
    isHover1: false,
    isHover2: false,
    isHover3: false,
    isHover4: false,
    isHover5: false,
    isHover6: false
  };

  stylesSvg = {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column"
  };

  componentDidMount() {
    this.handleMouseEnter6();
  }

  handleCardResult = marginTop => {
    return (
      <div styleName="result-container-right" style={{ marginTop }}>
        <div>
          <p styleName="text-result">Lucro</p>
          <div styleName="result-right">
            <p styleName="text-result">00000</p>
          </div>
        </div>
        <div>
          <p styleName="text-result">Chance</p>
          <div styleName="result-right">
            <p styleName="text-result">00000</p>
            <p styleName="text-result">%</p>
          </div>
        </div>
      </div>
    );
  };

  handleMouseEnter = () => {
    this.setState({ isHover: true });
  };

  handleMouseEnter1 = () => {
    this.setState({ isHover1: true });
  };

  handleMouseEnter2 = () => {
    this.setState({ isHover2: true });
  };

  handleMouseEnter3 = () => {
    this.setState({ isHover3: true });
  };

  handleMouseEnter4 = () => {
    this.setState({ isHover4: true });
  };

  handleMouseEnter5 = () => {
    this.setState({ isHover5: true });
  };

  handleMouseEnter6 = () => {
    this.setState({ isHover6: true });
  };

  handleMouseLeave = () => {
    this.setState({
      isHover: false,
      isHover1: false,
      isHover2: false,
      isHover3: false,
      isHover4: false,
      isHover5: false,
      isHover6: false
    });
  };

  render() {
    const {
      isHover,
      isHover1,
      isHover2,
      isHover3,
      isHover4,
      isHover5,
      isHover6
    } = this.state;

    return (
      <div styleName="container">
        <div styleName="row-container">
          <div styleName="column-container">
            <div
              styleName="result-container"
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}
            >
              <div>
                <DiamondFill color={isHover ? "white" : "#3A3A83"} />
                <DiamondFill color={isHover ? "white" : "#3A3A83"} />
                <DiamondFill color={isHover ? "white" : "#3A3A83"} />
                <DiamondFill color={isHover ? "white" : "#3A3A83"} />
                <DiamondFill color={isHover ? "white" : "#3A3A83"} />
              </div>

              <p styleName="text-result">50,00x</p>
            </div>
            <div
              styleName="result-container"
              onMouseEnter={this.handleMouseEnter1}
              onMouseLeave={this.handleMouseLeave}
            >
              <div>
                <DiamondFill color={isHover1 ? "white" : "#3A3A83"} />
                <DiamondFill color={isHover1 ? "white" : "#3A3A83"} />
                <DiamondFill color={isHover1 ? "white" : "#3A3A83"} />
                <DiamondFill color={isHover1 ? "white" : "#3A3A83"} />
                <Diamond color="#0E0C1B" />
              </div>

              <p styleName="text-result">5,00x</p>
            </div>
            <div
              styleName="result-container"
              onMouseEnter={this.handleMouseEnter2}
              onMouseLeave={this.handleMouseLeave}
            >
              <div>
                <DiamondFill color={isHover2 ? "white" : "#3A3A83"} />
                <DiamondFill color={isHover2 ? "white" : "#3A3A83"} />
                <DiamondFill color={isHover2 ? "white" : "#3A3A83"} />
                <DiamondWithBorder color={isHover2 ? "white" : "#3A3A83"} />
                <DiamondWithBorder color={isHover2 ? "white" : "#3A3A83"} />
              </div>

              <p styleName="text-result">4,00x</p>
            </div>
            <div
              styleName="result-container"
              onMouseEnter={this.handleMouseEnter3}
              onMouseLeave={this.handleMouseLeave}
            >
              <div>
                <DiamondFill color={isHover3 ? "white" : "#3A3A83"} />
                <DiamondFill color={isHover3 ? "white" : "#3A3A83"} />
                <DiamondFill color={isHover3 ? "white" : "#3A3A83"} />
                <Diamond color="#0E0C1B" />
                <Diamond color="#0E0C1B" />
              </div>

              <p styleName="text-result">3,00x</p>
            </div>
            <div
              styleName="result-container"
              onMouseEnter={this.handleMouseEnter4}
              onMouseLeave={this.handleMouseLeave}
            >
              <div>
                <DiamondFill color={isHover4 ? "white" : "#3A3A83"} />
                <DiamondFill color={isHover4 ? "white" : "#3A3A83"} />
                <DiamondWithBorder color={isHover4 ? "white" : "#3A3A83"} />
                <DiamondWithBorder color={isHover4 ? "white" : "#3A3A83"} />
                <Diamond color="#0E0C1B" />
              </div>

              <p styleName="text-result">0,10x</p>
            </div>
            <div
              styleName="result-container"
              onMouseEnter={this.handleMouseEnter5}
              onMouseLeave={this.handleMouseLeave}
            >
              <div>
                <DiamondFill color={isHover5 ? "white" : "#3A3A83"} />
                <DiamondFill color={isHover5 ? "white" : "#3A3A83"} />
                <Diamond color="#0E0C1B" />
                <Diamond color="#0E0C1B" />
                <Diamond color="#0E0C1B" />
              </div>

              <p styleName="text-result">0,00x</p>
            </div>
            <div
              styleName="result-container"
              onMouseEnter={this.handleMouseEnter6}
              onMouseLeave={this.handleMouseLeave}
            >
              <div>
                <Diamond color="#0E0C1B" />
                <Diamond color="#0E0C1B" />
                <Diamond color="#0E0C1B" />
                <Diamond color="#0E0C1B" />
                <Diamond color="#0E0C1B" />
              </div>
              <p styleName="text-result">0,00x</p>
            </div>
          </div>
          {isHover ? this.handleCardResult("0px") : null}
          {isHover1 ? this.handleCardResult("40px") : null}
          {isHover2 ? this.handleCardResult("80px") : null}
          {isHover3 ? this.handleCardResult("120px") : null}
          {isHover4 ? this.handleCardResult("160px") : null}
          {isHover5 ? this.handleCardResult("200px") : null}
          {isHover6 ? this.handleCardResult("220px") : null}
        </div>
        <div styleName="container-center">
          <div styleName="second-container">
            <div style={this.stylesSvg}>
              <img
                src={hexagonDiamond}
                alt=""
                className="svg-animated"
                style={{ zIndex: 1 }}
              />
              <div styleName="bottom-base-svg" />
            </div>
            <div style={this.stylesSvg}>
              <img
                src={octagonDiamond}
                alt=""
                className="svg-animated"
                style={{ zIndex: 1 }}
              />
              <div styleName="bottom-base-svg" />
            </div>
            <div style={this.stylesSvg}>
              <img
                src={pentagonDiamond}
                alt=""
                className="svg-animated"
                style={{ zIndex: 1 }}
              />
              <div styleName="bottom-base-svg" />
            </div>
            <div style={this.stylesSvg}>
              <img
                src={quadrilateralDiamond}
                alt=""
                className="svg-animated"
                style={{ zIndex: 1 }}
              />
              <div styleName="bottom-base-svg" />
            </div>
            <div style={this.stylesSvg}>
              <img
                src={quadrilateralDiamondGreen}
                alt=""
                className="svg-animated"
                style={{ zIndex: 1 }}
              />
              <div styleName="bottom-base-svg" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DiamondGame;
