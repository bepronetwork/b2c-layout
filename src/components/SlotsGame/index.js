import React from "react";
import propTypes from "prop-types";

import styles from "./index.css";
import images from "./images";
import HandleLines from "../SlotsLines/Lines";
import Quadrilateral from "../../assets/icons/SlotsIcons/dog2.svg";

class SlotsGame extends React.Component {
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
      insertIndex
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
                  <p className={styles.resultCardText}>0,25x</p>
                  <p className={styles.resultCardText}>0,0000000</p>
                </div>
              </div>
            ) : null}
            <div id="columnItem" className={styles.columnSpinner}>
              {resultFirstColumn.map((num, index) => {
                return index === insertIndex[0] && testBol[0] === true ? (
                  <img src={Quadrilateral} alt="" className={styles.icon} />
                ) : (
                  <img src={images[num]} alt="" className={styles.iconStatic} />
                );
              })}
            </div>
            <div className={styles.separatedLine} />
            <div id="columnItem2" className={styles.columnSpinner}>
              {resultSecondColumn.map((num, index) => {
                return (
                  <img
                    src={images[num]}
                    alt=""
                    className={
                      index === insertIndex[1] && testBol[1] === true
                        ? styles.icon
                        : styles.iconStatic
                    }
                  />
                );
              })}
            </div>
            <div className={styles.separatedLine} />
            <div id="columnItem3" className={styles.columnSpinner}>
              {resultThirstColumn.map((num, index) => {
                return (
                  <img
                    src={images[num]}
                    alt=""
                    className={
                      index === insertIndex[2] && testBol[2] === true
                        ? styles.icon
                        : styles.iconStatic
                    }
                  />
                );
              })}
            </div>
            <div className={styles.separatedLine} />
            <div id="columnItem4" className={styles.columnSpinner}>
              {resultFourthColumn.map((num, index) => {
                return (
                  <img
                    src={images[num]}
                    alt=""
                    className={
                      index === insertIndex[3] && testBol[3] === true
                        ? styles.icon
                        : styles.iconStatic
                    }
                  />
                );
              })}
            </div>
            <div className={styles.separatedLine} />
            <div id="columnItem5" className={styles.columnSpinner}>
              {resultFiveColumn.map((num, index) => {
                return (
                  <img
                    src={images[num]}
                    alt=""
                    className={
                      index === insertIndex[4] && testBol[4] === true
                        ? styles.icon
                        : styles.iconStatic
                    }
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
  insertIndex: propTypes.arrayOf(propTypes.number).isRequired
};

export default SlotsGame;
