import React from "react";
import propTypes from "prop-types";

import styles from "./index.css";
import { images } from "./images";
import HandleLines from "../SlotsLines/Lines";

import Coin from "../../assets/icons/SlotsIcons/coin2.svg";
import BlueCoin from "../../assets/icons/SlotsIcons/bluecoin2.svg";
import Club from "../../assets/icons/SlotsIcons/club2.svg";
import Spade from "../../assets/icons/SlotsIcons/spade2.svg";
import Heart from "../../assets/icons/SlotsIcons/heart2.svg";
import Octagon from "../../assets/icons/SlotsIcons/octagon2.svg";
import DogJS from "../../assets/icons/SlotsIcons/dog2.svg";
import Quadrilateral from "../../assets/icons/SlotsIcons/quadrilateral2.svg";
import Diamond from "../../assets/icons/SlotsIcons/diamond2.svg";
import Triangle from "../../assets/icons/SlotsIcons/triangle2.svg";
import Pentagon from "../../assets/icons/SlotsIcons/pentagon2.svg";
import Beetle from "../../assets/icons/SlotsIcons/beetle2.svg";
import Esfinge from "../../assets/icons/SlotsIcons/esfinge2.svg";

class SlotsGame extends React.Component {
  selectNumber = (num) => {
    switch (num) {
      case 0:
        return BlueCoin;
      case 1:
        return Coin;
      case 2:
        return Club;
      case 3:
        return Spade;
      case 4:
        return Quadrilateral;
      case 5:
        return Heart;
      case 6:
        return Octagon;
      case 7:
        return DogJS;
      case 8:
        return Diamond;
      case 9:
        return Triangle;
      case 10:
        return Pentagon;
      case 11:
        return Beetle;
      case 12:
        return Esfinge;

      default:
        break;
    }
  };

  render() {
    const {
      testBol,
      line,
      testArray,
      result,
      resultFirstColumn,
      resultSecondColumn,
      resultThirstColumn,
      resultFourthColumn,
      resultFiveColumn,
      insertIndex,
      winAmount,
      multiplier,
    } = this.props;

    return (
      <div className={styles.containerInit}>
        <div className={styles.rowContainer}>
          <div className={styles.spinnerContainer}>
            <div className={styles.lineTest}>
              {line === true ? (
                <HandleLines
                  arrayResult={testArray[0]}
                  insertion1={insertIndex[0]}
                  insertion2={insertIndex[1]}
                  insertion3={insertIndex[2]}
                  insertion4={insertIndex[3]}
                  insertion5={insertIndex[4]}
                />
              ) : null}
            </div>
            {testBol[0] ||
            testBol[1] ||
            testBol[2] ||
            testBol[4] ||
            testBol[3] ? (
              <div className={styles.backgroundTransparence} />
            ) : null}
            {result ? (
              <div className={styles.resultCard}>
                <div className={styles.columnContainer}>
                  <p className={styles.resultCardText}>{multiplier}x</p>
                  <p className={styles.resultCardText}>{winAmount}</p>
                </div>
              </div>
            ) : null}
            <div id="columnItem" className={styles.columnSpinner}>
              {resultFirstColumn.map((num, index) => {
                return index === insertIndex[0] ? (
                  <object
                    type="image/svg+xml"
                    data={this.selectNumber(num)}
                    className={styles.icon}
                  >
                    svg-animation
                  </object>
                ) : (
                  <img
                    src={images[num]}
                    alt="Result Illustration"
                    className={styles.iconStatic}
                  />
                );
              })}
            </div>
            <div className={styles.separatedLine} />
            <div id="columnItem2" className={styles.columnSpinner}>
              {resultSecondColumn.map((num, index) => {
                return index === insertIndex[1] ? (
                  <object
                    type="image/svg+xml"
                    data={this.selectNumber(num)}
                    className={styles.icon}
                  >
                    svg-animation
                  </object>
                ) : (
                  <img
                    src={images[num]}
                    alt="Result Illustration"
                    className={styles.iconStatic}
                  />
                );
              })}
            </div>
            <div className={styles.separatedLine} />
            <div id="columnItem3" className={styles.columnSpinner}>
              {resultThirstColumn.map((num, index) => {
                return index === insertIndex[2] ? (
                  <object
                    type="image/svg+xml"
                    data={this.selectNumber(num)}
                    className={styles.icon}
                  >
                    svg-animation
                  </object>
                ) : (
                  <img
                    src={images[num]}
                    alt="Result Illustration"
                    className={styles.iconStatic}
                  />
                );
              })}
            </div>
            <div className={styles.separatedLine} />
            <div id="columnItem4" className={styles.columnSpinner}>
              {resultFourthColumn.map((num, index) => {
                return index === insertIndex[3] ? (
                  <object
                    type="image/svg+xml"
                    data={this.selectNumber(num)}
                    className={styles.icon}
                  >
                    svg-animation
                  </object>
                ) : (
                  <img
                    src={images[num]}
                    alt="Result Illustration"
                    className={styles.iconStatic}
                  />
                );
              })}
            </div>
            <div className={styles.separatedLine} />
            <div id="columnItem5" className={styles.columnSpinner}>
              {resultFiveColumn.map((num, index) => {
                return index === insertIndex[4] ? (
                  <object
                    type="image/svg+xml"
                    data={this.selectNumber(num)}
                    className={styles.icon}
                  >
                    svg-animation
                  </object>
                ) : (
                  <img
                    src={images[num]}
                    alt="Result Illustration"
                    className={styles.iconStatic}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SlotsGame.propTypes = {
  testBol: propTypes.bool.isRequired,
  line: propTypes.bool.isRequired,
  testArray: propTypes.arrayOf(propTypes.number).isRequired,
  result: propTypes.bool.isRequired,
  resultFirstColumn: propTypes.arrayOf(propTypes.number).isRequired,
  resultSecondColumn: propTypes.arrayOf(propTypes.number).isRequired,
  resultThirstColumn: propTypes.arrayOf(propTypes.number).isRequired,
  resultFourthColumn: propTypes.arrayOf(propTypes.number).isRequired,
  resultFiveColumn: propTypes.arrayOf(propTypes.number).isRequired,
  insertIndex: propTypes.arrayOf(propTypes.number).isRequired,
  winAmount: propTypes.string.isRequired,
  multiplier: propTypes.string.isRequired,
};

export default SlotsGame;
