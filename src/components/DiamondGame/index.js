import React, { Component } from "react";

import Diamond from "../../assets/DiamondIcons/diamond";
import DiamondFill from "../../assets/DiamondIcons/diamond-fill";
import DiamondWithBorder from "../../assets/DiamondIcons/diamond-with-border";

import images from "./images";

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
    flexDirection: "column",
    zIndex: 1
  };

  handleMouseEnter = () => {
    this.setState({
      isHover: true,
      isHover1: false,
      isHover2: false,
      isHover3: false,
      isHover4: false,
      isHover5: false,
      isHover6: false
    });
  };

  handleMouseEnter1 = () => {
    this.setState({
      isHover: false,
      isHover1: true,
      isHover2: false,
      isHover3: false,
      isHover4: false,
      isHover5: false,
      isHover6: false
    });
  };

  handleMouseEnter2 = () => {
    this.setState({
      isHover: false,
      isHover1: false,
      isHover2: true,
      isHover3: false,
      isHover4: false,
      isHover5: false,
      isHover6: false
    });
  };

  handleMouseEnter3 = () => {
    this.setState({
      isHover: false,
      isHover1: false,
      isHover2: false,
      isHover3: true,
      isHover4: false,
      isHover5: false,
      isHover6: false
    });
  };

  handleMouseEnter4 = () => {
    this.setState({
      isHover: false,
      isHover1: false,
      isHover2: false,
      isHover3: false,
      isHover4: true,
      isHover5: false,
      isHover6: false
    });
  };

  handleMouseEnter5 = () => {
    this.setState({
      isHover: false,
      isHover1: false,
      isHover2: false,
      isHover3: false,
      isHover4: false,
      isHover5: true,
      isHover6: false
    });
  };

  handleMouseEnter6 = () => {
    this.setState({
      isHover: false,
      isHover1: false,
      isHover2: false,
      isHover3: false,
      isHover4: false,
      isHover5: false,
      isHover6: true
    });
  };

  handleCardResult = (marginTop, profit, chance) => {
    return (
      <div styleName="result-container-right" style={{ marginTop }}>
        <div>
          <p styleName="text-result">Lucro</p>
          <div styleName="result-right">
            <p styleName="text-result">{profit}</p>
          </div>
        </div>
        <div>
          <p styleName="text-result">Chance</p>
          <div styleName="result-right">
            <p styleName="text-result">{chance}</p>
            <p styleName="text-result">%</p>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { backendResult, isActiveBottomBar } = this.props;

    const {
      isHover,
      isHover1,
      isHover2,
      isHover3,
      isHover4,
      isHover5,
      isHover6
    } = this.props;

    return (
      <div styleName="container">
        <div styleName="row-container">
          <div styleName="column-container">
            <div
              styleName="result-container"
              onMouseEnter={this.handleMouseEnter}
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
          {isHover ? this.handleCardResult("0px", "00000", "0.04") : null}
          {isHover1 ? this.handleCardResult("40px", "00000", "1.25") : null}
          {isHover2 ? this.handleCardResult("80px", "00000", "2.50") : null}
          {isHover3 ? this.handleCardResult("120px", "00000", "12.49") : null}
          {isHover4 ? this.handleCardResult("160px", "00000", "18.74") : null}
          {isHover5 ? this.handleCardResult("200px", "00000", "49.98") : null}
          {isHover6 ? this.handleCardResult("220px", "00000", "14.99") : null}
        </div>

        <div styleName="container-center">
          <div styleName="second-container">
            <div styleName="container-center">
              <div styleName="row-container svg-animated-container container-center">
                {backendResult.map((num, index) => {
                  return (
                    <div style={this.stylesSvg}>
                      <img
                        src={images[num].img}
                        alt=""
                        className="svg-animated"
                        style={{ zIndex: 1 }}
                      />
                    </div>
                  );
                })}
              </div>
              <div styleName="row-container container-center">
                {isActiveBottomBar ? (
                  backendResult.map(num => {
                    return (
                      <div
                        styleName="bottom-base-svg"
                        key={images.id}
                        style={{
                          backgroundColor: images[num].isActive
                            ? images[num].color
                            : "rgb(29, 26, 55)"
                        }}
                      />
                    );
                  })
                ) : (
                  <div styleName="row-container container-center">
                    <div styleName="bottom-base-svg" id="test" />
                    <div styleName="bottom-base-svg" id="test1" />
                    <div styleName="bottom-base-svg" id="test2" />
                    <div styleName="bottom-base-svg" id="test3" />
                    <div styleName="bottom-base-svg" id="test4" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DiamondGame;
