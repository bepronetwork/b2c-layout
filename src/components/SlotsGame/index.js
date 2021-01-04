import React from "react";
import PropTypes from "prop-types";
import { uniqueId } from "lodash";
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

const propTypes = {
  testBol: PropTypes.arrayOf(PropTypes.bool).isRequired,
  line: PropTypes.bool.isRequired,
  testArray: PropTypes.arrayOf(PropTypes.number).isRequired,
  result: PropTypes.bool,
  resultFirstColumn: PropTypes.arrayOf(PropTypes.number).isRequired,
  resultSecondColumn: PropTypes.arrayOf(PropTypes.number).isRequired,
  resultThirstColumn: PropTypes.arrayOf(PropTypes.number).isRequired,
  resultFourthColumn: PropTypes.arrayOf(PropTypes.number).isRequired,
  resultFiveColumn: PropTypes.arrayOf(PropTypes.number).isRequired,
  insertIndex: PropTypes.arrayOf(PropTypes.number).isRequired,
  winAmount: PropTypes.string,
  multiplier: PropTypes.number.isRequired
};

const defaultProps = {
  result: false,
  winAmount: ""
};

class SlotsGame extends React.Component {
  selectNumber = num => {
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

    return null;
  };

  renderColumn = (results, columnIndex) => {
    const { insertIndex } = this.props;

    return (
      <>
        <div
          id="columnItem"
          className={styles.columnSpinner}
          key={uniqueId(`slots-game--column--${columnIndex}-`)}
        >
          {results.map((num, index) => {
            return index === insertIndex[index] ? (
              <object
                key={uniqueId(`slots-game--column-item--${num}-`)}
                type="image/svg+xml"
                data={this.selectNumber(num)}
                className={styles.icon}
              >
                svg-animation
              </object>
            ) : (
              <img
                key={uniqueId(`slots-game--column-item--${num}-`)}
                src={images[num]}
                alt="Slot"
                className={styles.iconStatic}
              />
            );
          })}
        </div>
        {!(columnIndex === 4) && <div className={styles.separatedLine} />}
      </>
    );
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
      multiplier
    } = this.props;

    return (
      <div className={styles.containerInit}>
        <div className={styles.rowContainer}>
          <div className={styles.spinnerContainer}>
            <div className={styles.lineTest}>
              {line && (
                <HandleLines
                  arrayResult={testArray[0]}
                  insertion1={insertIndex[0]}
                  insertion2={insertIndex[1]}
                  insertion3={insertIndex[2]}
                  insertion4={insertIndex[3]}
                  insertion5={insertIndex[4]}
                />
              )}
            </div>
            {(testBol[0] ||
              testBol[1] ||
              testBol[2] ||
              testBol[4] ||
              testBol[3]) && <div className={styles.backgroundTransparence} />}
            {result && (
              <div className={styles.resultCard}>
                <div className={styles.columnContainer}>
                  <p className={styles.resultCardText}>{multiplier}x</p>
                  <p className={styles.resultCardText}>{winAmount}</p>
                </div>
              </div>
            )}
            {[
              resultFirstColumn,
              resultSecondColumn,
              resultThirstColumn,
              resultFourthColumn,
              resultFiveColumn
            ].map((column, index) => this.renderColumn(column, index))}
          </div>
        </div>
      </div>
    );
  }
}

SlotsGame.propTypes = propTypes;
SlotsGame.defaultProps = defaultProps;

export default SlotsGame;
