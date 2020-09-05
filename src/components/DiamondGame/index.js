import React, { Component } from "react";
import PropTypes from "prop-types";

import handleCardResult from "./resultCard";
import Diamond from "../../assets/DiamondIcons/diamond";
import DiamondFill from "../../assets/DiamondIcons/diamond-fill";
import DiamondWithBorder from "../../assets/DiamondIcons/diamond-with-border";

import images from "./images";

import "./index.css";

class DiamondGame extends Component {
  render() {
    const {
      backendResult,
      isActiveBottomBar,
      isHover,
      isHover1,
      isHover2,
      isHover3,
      isHover4,
      isHover5,
      isHover6,
      isVisible1,
      isVisible2,
      isVisible3,
      isVisible4,
      isVisible5,
      profitAmount,
      resultSpace,
      handleMouseEnter,
      handleMouseEnter1,
      handleMouseEnter2,
      handleMouseEnter3,
      handleMouseEnter4,
      handleMouseEnter5,
      handleMouseEnter6
    } = this.props;

    return (
      <div styleName="container">
        <div styleName="row-container">
          <div styleName="column-container result-grid-container">
            <div>
              <div
                styleName="result-container"
                onMouseEnter={handleMouseEnter}
              >
                <div>
                  <DiamondFill
                    color={isHover ? "white" : "#3A3A83"}
                    width="18%"
                  />
                  <DiamondFill
                    color={isHover ? "white" : "#3A3A83"}
                    width="18%"
                  />
                  <DiamondFill
                    color={isHover ? "white" : "#3A3A83"}
                    width="18%"
                  />
                  <DiamondFill
                    color={isHover ? "white" : "#3A3A83"}
                    width="18%"
                  />
                  <DiamondFill
                    color={isHover ? "white" : "#3A3A83"}
                    width="18%"
                  />
                </div>
                <p styleName="text-result">
                  {`${resultSpace[6].multiplier.toFixed(2)}x`}
                </p>
              </div>
              <div
                styleName="result-container"
                onMouseEnter={handleMouseEnter1}
              >
                <div>
                  <DiamondFill
                    color={isHover1 ? "white" : "#3A3A83"}
                    width="18%"
                  />
                  <DiamondFill
                    color={isHover1 ? "white" : "#3A3A83"}
                    width="18%"
                  />
                  <DiamondFill
                    color={isHover1 ? "white" : "#3A3A83"}
                    width="18%"
                  />
                  <DiamondFill
                    color={isHover1 ? "white" : "#3A3A83"}
                    width="18%"
                  />
                  <Diamond color="#0E0C1B" width="18%" />
                </div>

                <p styleName="text-result">
                  {`${resultSpace[5].multiplier.toFixed(2)}x`}
                </p>
              </div>
              <div
                styleName="result-container"
                onMouseEnter={handleMouseEnter2}
              >
                <div>
                  <DiamondFill
                    color={isHover2 ? "white" : "#3A3A83"}
                    width="18%"
                  />
                  <DiamondFill
                    color={isHover2 ? "white" : "#3A3A83"}
                    width="18%"
                  />
                  <DiamondFill
                    color={isHover2 ? "white" : "#3A3A83"}
                    width="18%"
                  />
                  <DiamondWithBorder
                    color={isHover2 ? "white" : "#3A3A83"}
                    width="18%"
                  />
                  <DiamondWithBorder
                    color={isHover2 ? "white" : "#3A3A83"}
                    width="18%"
                  />
                </div>
                <p styleName="text-result">
                  {`${resultSpace[4].multiplier.toFixed(2)}x`}
                </p>
              </div>
            </div>
            <div>
              <div
                styleName="result-container"
                onMouseEnter={handleMouseEnter3}
              >
                <div>
                  <DiamondFill
                    color={isHover3 ? "white" : "#3A3A83"}
                    width="18%"
                  />
                  <DiamondFill
                    color={isHover3 ? "white" : "#3A3A83"}
                    width="18%"
                  />
                  <DiamondFill
                    color={isHover3 ? "white" : "#3A3A83"}
                    width="18%"
                  />
                  <Diamond color="#0E0C1B" width="18%" />
                  <Diamond color="#0E0C1B" width="18%" />
                </div>

                <p styleName="text-result">
                  {`${resultSpace[3].multiplier.toFixed(2)}x`}
                </p>
              </div>
              <div
                styleName="result-container"
                onMouseEnter={handleMouseEnter4}
              >
                <div>
                  <DiamondFill
                    color={isHover4 ? "white" : "#3A3A83"}
                    width="18%"
                  />
                  <DiamondFill
                    color={isHover4 ? "white" : "#3A3A83"}
                    width="18%"
                  />
                  <DiamondWithBorder
                    color={isHover4 ? "white" : "#3A3A83"}
                    width="18%"
                  />
                  <DiamondWithBorder
                    color={isHover4 ? "white" : "#3A3A83"}
                    width="18%"
                  />
                  <Diamond color="#0E0C1B" width="18%" />
                </div>

                <p styleName="text-result">
                  {`${resultSpace[2].multiplier.toFixed(2)}x`}
                </p>
              </div>
              <div
                styleName="result-container"
                onMouseEnter={handleMouseEnter5}
              >
                <div>
                  <DiamondFill
                    color={isHover5 ? "white" : "#3A3A83"}
                    width="18%"
                  />
                  <DiamondFill
                    color={isHover5 ? "white" : "#3A3A83"}
                    width="18%"
                  />
                  <Diamond color="#0E0C1B" width="18%" />
                  <Diamond color="#0E0C1B" width="18%" />
                  <Diamond color="#0E0C1B" width="18%" />
                </div>

                <p styleName="text-result">
                  {`${resultSpace[1].multiplier.toFixed(2)}x`}
                </p>
              </div>
            </div>
            <div styleName="result-container" onMouseEnter={handleMouseEnter6}>
              <div>
                <Diamond color="#0E0C1B" width="18%" />
                <Diamond color="#0E0C1B" width="18%" />
                <Diamond color="#0E0C1B" width="18%" />
                <Diamond color="#0E0C1B" width="18%" />
                <Diamond color="#0E0C1B" width="18%" />
              </div>
              <p styleName="text-result">
                {`${resultSpace[0].multiplier.toFixed(2)}x`}
              </p>
            </div>
          </div>
          {isHover
            ? handleCardResult(
                "0px",
                backendResult.length > 0 ? profitAmount : "0",
                (resultSpace[6].probability * 100).toFixed(2)
              )
            : null}
          {isHover1
            ? handleCardResult(
                "40px",
                backendResult.length > 0 ? profitAmount : "0",
                (resultSpace[5].probability * 100).toFixed(2)
              )
            : null}
          {isHover2
            ? handleCardResult(
                "80px",
                backendResult.length > 0 ? profitAmount : "0",
                (resultSpace[4].probability * 100).toFixed(2)
              )
            : null}
          {isHover3
            ? handleCardResult(
                "120px",
                backendResult.length > 0 ? profitAmount : "0",
                (resultSpace[3].probability * 100).toFixed(2)
              )
            : null}
          {isHover4
            ? handleCardResult(
                "160px",
                backendResult.length > 0 ? profitAmount : "0",
                (resultSpace[2].probability * 100).toFixed(2)
              )
            : null}
          {isHover5
            ? handleCardResult(
                "180px",
                backendResult.length > 0 ? profitAmount : "0",
                (resultSpace[1].probability * 100).toFixed(2)
              )
            : null}
          {isHover6
            ? handleCardResult(
                "190px",
                backendResult.length > 0 ? profitAmount : "0",
                (resultSpace[0].probability * 100).toFixed(2)
              )
            : null}
        </div>

        <div styleName="container-center">
          <div styleName="second-container">
            <div styleName="container-center">
              <div
                styleName="row-container svg-animated-container container-center"
                id="svg-diamond-animated"
              >
                <div
                  styleName="svg-animated-container container-center"
                  id="svg-diamond-animated-1"
                >
                  {backendResult.slice(0, 1).map(num => {
                    return isVisible1 ? (
                      <div styleName="svg-animated">
                        <object
                          type="image/svg+xml"
                          data={images[num].img}
                          styleName="svg"
                        >
                          svg-animation
                        </object>
                      </div>
                    ) : null;
                  })}
                </div>
                <div
                  styleName="svg-animated-container container-center"
                  id="svg-diamond-animated-2"
                >
                  {backendResult.slice(1, 2).map(num => {
                    return isVisible2 ? (
                      <div styleName="svg-animated">
                        <object
                          type="image/svg+xml"
                          data={images[num].img}
                          styleName="svg"
                        >
                          svg-animation
                        </object>
                      </div>
                    ) : null;
                  })}
                </div>
                <div
                  styleName="svg-animated-container container-center"
                  id="svg-diamond-animated-3"
                >
                  {backendResult.slice(2, 3).map(num => {
                    return isVisible3 ? (
                      <div styleName="svg-animated">
                        <object
                          type="image/svg+xml"
                          data={images[num].img}
                          styleName="svg"
                        >
                          svg-animation
                        </object>
                      </div>
                    ) : null;
                  })}
                </div>
                <div
                  styleName="svg-animated-container container-center"
                  id="svg-diamond-animated-4"
                >
                  {backendResult.slice(3, 4).map(num => {
                    return isVisible4 ? (
                      <div styleName="svg-animated">
                        <object
                          type="image/svg+xml"
                          data={images[num].img}
                          styleName="svg"
                        >
                          svg-animation
                        </object>
                      </div>
                    ) : null;
                  })}
                </div>
                <div
                  styleName="svg-animated-container container-center"
                  id="svg-diamond-animated-5"
                >
                  {backendResult.slice(4, 5).map(num => {
                    return isVisible5 ? (
                      <div styleName="svg-animated">
                        <object
                          type="image/svg+xml"
                          data={images[num].img}
                          styleName="svg"
                        >
                          svg-animation
                        </object>
                      </div>
                    ) : null;
                  })}
                </div>
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

DiamondGame.propTypes = {
  backendResult: PropTypes.arrayOf.isRequired,
  isActiveBottomBar: PropTypes.bool.isRequired,
  isHover: PropTypes.bool.isRequired,
  isHover1: PropTypes.bool.isRequired,
  isHover2: PropTypes.bool.isRequired,
  isHover3: PropTypes.bool.isRequired,
  isHover4: PropTypes.bool.isRequired,
  isHover5: PropTypes.bool.isRequired,
  isHover6: PropTypes.bool.isRequired,
  handleMouseEnter: PropTypes.func.isRequired,
  handleMouseEnter1: PropTypes.func.isRequired,
  handleMouseEnter2: PropTypes.func.isRequired,
  handleMouseEnter3: PropTypes.func.isRequired,
  handleMouseEnter4: PropTypes.func.isRequired,
  handleMouseEnter5: PropTypes.func.isRequired,
  handleMouseEnter6: PropTypes.func.isRequired,
  isVisible1: PropTypes.bool.isRequired,
  isVisible2: PropTypes.bool.isRequired,
  isVisible3: PropTypes.bool.isRequired,
  isVisible4: PropTypes.bool.isRequired,
  isVisible5: PropTypes.bool.isRequired,
  profitAmount: PropTypes.number.isRequired,
  resultSpace: PropTypes.number.isRequired
};

export default DiamondGame;
