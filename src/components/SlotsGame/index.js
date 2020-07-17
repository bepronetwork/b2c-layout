import React from "react";

import Line from "components/SlotsLines";
import styles from "./index.css";
import numberOfLines from "../SlotsGameOptions/numberofLines";
import images from "./Spinner/images";

class SlotsGame extends React.Component {
  static matches = [];

  constructor(props) {
    super(props);
    this.state = {
      winner: false,
      matrixResult: [],
      testBol: Array(5).fill(false),
      testArray: [[1, 1, 2, 4, 2]],
      resultFirstColumn: [],
      resultSecondColumn: [],
      resultThirstColumn: [],
      resultFourthColumn: [],
      resultFiveColumn: []
    };
    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount() {
    await this.setNewRandomMatrix();
    this.getcolumn();
  }

  randomTable = (rows, cols) =>
    Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.floor(Math.random() * 8))
    );

  handleClick = async () => {
    const { testBol, testArray } = this.state;

    this.setState({ winner: false });
    this.setState({ testBol: Array(5).fill(false) });

    this.getcolumn();
    await this.handleAnimations();

    // this.setInsertArray();
    this.randomNumberResult();
    await this.handleImage(500);
  };

  handleAnimations = async () => {
    await this.handleAnimation("columnItem");
    await this.handleAnimation("columnItem2");
    await this.handleAnimation("columnItem3");
    await this.handleAnimation("columnItem4");
    await this.handleAnimation("columnItem5");
  };

  handleAnimation = async spinnerColumn => {
    const box = document.getElementById(spinnerColumn);

    box.animate(
      [
        { transform: "translate3D(0, -30px, 0)" },
        { transform: "translate3D(0, 600px, 0)" }
      ],
      {
        duration: 1000,
        iterations: 4
      }
    );

    return new Promise(resolve => setTimeout(() => resolve(), 300));
  };

  async setNewRandomMatrix() {
    const resultRow = this.randomTable(40, 5);

    this.setState({ matrixResult: resultRow });
  }

  setInsertArray() {
    const { matrixResult, testArray } = this.state;
    const insertArray = matrixResult.splice(19, 1, ...testArray);

    return insertArray;
  }

  randomNumber(min, max) {
    const result = Math.floor(Math.random() * (max - min) + min);

    return result;
  }

  async getcolumn() {
    const { matrixResult } = this.state;
    const arrayColumn = (arr, n) => {
      return arr.map(x => x[n]);
    };

    await this.setNewRandomMatrix();

    const resultFirstColumn = arrayColumn(matrixResult, 0);
    const resultSecondColumn = arrayColumn(matrixResult, 1);
    const resultThirstColumn = arrayColumn(matrixResult, 2);
    const resultFourthColumn = arrayColumn(matrixResult, 3);
    const resultFiveColumn = arrayColumn(matrixResult, 4);

    this.setState({ resultFirstColumn });
    this.setState({ resultSecondColumn });
    this.setState({ resultThirstColumn });
    this.setState({ resultFourthColumn });
    this.setState({ resultFiveColumn });
  }

  randomNumberResult() {
    const {
      testArray,
      resultFirstColumn,
      resultSecondColumn,
      resultThirstColumn,
      resultFourthColumn,
      resultFiveColumn
    } = this.state;

    const randNum = this.randomNumber(18, 21);
    const randNum2 = this.randomNumber(18, 21);
    const randNum3 = this.randomNumber(18, 21);
    const randNum4 = this.randomNumber(18, 21);
    const randNum5 = this.randomNumber(18, 21);

    const testArr = testArray[0];

    resultFirstColumn.splice(randNum, 1, testArr[0]);
    resultSecondColumn.splice(randNum2, 1, testArr[1]);
    resultThirstColumn.splice(randNum3, 1, testArr[2]);
    resultFourthColumn.splice(randNum4, 1, testArr[3]);
    resultFiveColumn.splice(randNum5, 1, testArr[4]);
  }

  async handleImage(setTimeOut) {
    const { testArray, testBol } = this.state;

    let i = 0;

    const testArr = testArray[0];

    while (i < 5) {
      if (testArr[0 + i] !== testArr[0 + (i + 1)]) {
        break;
      }

      testBol[0 + i] = true;
      testBol[0 + (i + 1)] = true;
      i += 1;
    }

    this.setState({ testBol });

    return new Promise(resolve => setTimeout(() => resolve(), setTimeOut));
  }

  render() {
    const {
      testBol,
      resultFirstColumn,
      resultSecondColumn,
      resultThirstColumn,
      resultFourthColumn,
      resultFiveColumn
    } = this.state;

    return (
      <div className={styles.containerInit}>
        <button onClick={this.handleClick} type="button">
          TESTE
        </button>
        <div className={styles.topContainer}>
          <h1 className={styles.topContainerText}>Pagamento total: 0.000000</h1>
        </div>
        <div className={styles.rowContainer}>
          <div className={styles.columnContainer}>
            <div style={{ margin: "25px 0px 0px 0px" }}>
              {numberOfLines.map(lines => {
                if (lines <= 3) {
                  return (
                    <div className={styles.textButton}>
                      <p>{lines}</p>
                    </div>
                  );
                }
              })}
            </div>
            <div style={{ margin: "15px" }}>
              {numberOfLines.map(lines => {
                if (lines >= 4 && lines <= 6) {
                  return (
                    <div className={styles.textButton}>
                      <p>{lines}</p>
                    </div>
                  );
                }
              })}
            </div>
            <div style={{ margin: "0px 0px 25px 0px" }}>
              {numberOfLines.map(lines => {
                if (lines >= 7 && lines <= 9) {
                  return (
                    <div className={styles.textButton}>
                      <p>{lines}</p>
                    </div>
                  );
                }
              })}
            </div>
          </div>

          <div className={styles.spinnerContainer}>
            <div
              width="600px"
              height="300px"
              style={{ border: "1px solid #d3d3d3;" }}
              className={styles.lineTest}
            >
              {testBol[58] ? (
                <Line
                  svgClass={styles.classLine}
                  polylineClass={styles.classSvg}
                  points="9 13,12 14, 80 14"
                  viewBox="0 3 100 100"
                />
              ) : null}

              {/* 1 */}
              {/* <Line
                svgClass={styles.classLine}
                polylineClass={styles.classSvg}
                points="9 10,12 15, 18 15, 47.4 92, 76 10"
                viewBox="0 5 100 100"
              /> */}

              {/* 3 */}
              {/* <Line
                svgClass={styles.classLine}
                polylineClass={styles.classSvg}
                points="9 20,12 15, 18 15, 33 55, 76 55"
                viewBox="0 5 100 100"
              /> */}

              {/* 5 */}
              {/* {testBol[59] ? (
                <Line
                  svgClass={styles.classLine}
                  polylineClass={styles.classSvg}
                  points="9 55,12 55, 18 55, 33 55, 76 55"
                  viewBox="0 5 100 100"
                />
              ) : null} */}
              {/* 
              {testBol[3] ? (
                <Line
                  svgClass={styles.classLine}
                  polylineClass={styles.classSvg}
                  points="10 97,12 94, 18 94, 33 94, 76 94"
                  viewBox="0 5 100 100"
                />
              ) : null} */}
            </div>
            {testBol[0] ||
            testBol[1] ||
            testBol[2] ||
            testBol[4] ||
            testBol[3] === true ? (
              <div className={styles.backgroundTransparence} />
            ) : null}

            {testBol[1] ? (
              <div className={styles.resultCard}>
                <div className={styles.columnContainer}>
                  <p className={styles.resultCardText}>0,25x</p>
                  <p className={styles.resultCardText}>0,0000000</p>
                </div>
              </div>
            ) : null}

            <div id="columnItem" className={styles.columnSpinner}>
              {resultFirstColumn.map((num, index) => {
                return (
                  <img
                    src={images[num]}
                    alt=""
                    className={
                      testBol[index] === true ? styles.icon : styles.iconStatic
                    }
                  />
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
                      testBol[index] === true ? styles.icon : styles.iconStatic
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
                      testBol[index] === true ? styles.icon : styles.iconStatic
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
                      testBol[index] === true ? styles.icon : styles.iconStatic
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
                      testBol[index] === true ? styles.icon : styles.iconStatic
                    }
                  />
                );
              })}
            </div>
          </div>
          <div className={styles.columnContainer}>
            <div style={{ margin: "25px 0px 0px 0px" }}>
              {numberOfLines.map(lines => {
                if (lines >= 10 && lines <= 12) {
                  return (
                    <div className={styles.textButton}>
                      <p>{lines}</p>
                    </div>
                  );
                }
              })}
            </div>

            <div style={{ margin: "15px" }}>
              {numberOfLines.map(lines => {
                if (lines >= 13 && lines <= 15) {
                  return (
                    <div className={styles.textButton}>
                      <p>{lines}</p>
                    </div>
                  );
                }
              })}
            </div>

            <div style={{ margin: "0px 0px 25px 0px" }}>
              {numberOfLines.map(lines => {
                if (lines >= 16 && lines <= 18) {
                  return (
                    <div className={styles.textButton}>
                      <p>{lines}</p>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SlotsGame;
