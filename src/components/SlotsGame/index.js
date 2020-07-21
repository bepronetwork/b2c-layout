import React from "react";

import Line from "components/SlotsLines";
import styles from "./index.css";
import images from "./Spinner/images";
import HandleLines from "../SlotsLines/Lines";

class SlotsGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      line: false,
      result: false,
      matrixResult: [],
      testBol: Array(5).fill(false),
      testArray: [[1, 1, 1, 4, 2]],
      resultFirstColumn: [],
      resultSecondColumn: [],
      resultThirstColumn: [],
      resultFourthColumn: [],
      resultFiveColumn: [],
      insertionIndex: [],
      insertIndex: []
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
    this.setState({ line: false });
    this.setState({ result: false });
    this.setState({ testBol: Array(5).fill(false) });
    this.setState({ insertionIndex: [] });
    this.setState({ insertIndex: [] });

    this.getcolumn();
    await this.handleAnimations();

    await this.handleImage(1000);
    await this.setResult();
  };

  handleAnimations = async () => {
    await this.handleAnimation("columnItem");
    await this.handleAnimation("columnItem2");
    await this.handleAnimation("columnItem3");
    await this.handleAnimation("columnItem4");
    await this.handleAnimation("columnItem5");

    await this.randomNumberResult();

    return new Promise(resolve => setTimeout(() => resolve(), 2000));
  };

  handleAnimation = async spinnerColumn => {
    const box = document.getElementById(spinnerColumn);

    box.animate(
      [
        { transform: "translate3D(0, -30px, 0)" },
        { transform: "translate3D(0, 600px, 0)" }
      ],
      {
        duration: 500,
        iterations: 8
      }
    );

    return new Promise(resolve => setTimeout(() => resolve(), 700));
  };

  setNewRandomMatrix = async () => {
    const resultRow = this.randomTable(40, 5);

    this.setState({ matrixResult: resultRow });
  };

  randomNumber(min, max) {
    const result = Math.floor(Math.random() * (max - min) + min);

    return result;
  }

  setResult = async () => {
    this.setState({ result: true });
  };

  getcolumn = async () => {
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
  };

  async randomNumberResult() {
    const {
      testArray,
      resultFirstColumn,
      resultSecondColumn,
      resultThirstColumn,
      resultFourthColumn,
      resultFiveColumn
    } = this.state;

    const randNum = this.randomNumber(18, 20);
    const randNum2 = this.randomNumber(18, 20);
    const randNum3 = this.randomNumber(18, 20);
    const randNum4 = this.randomNumber(18, 20);
    const randNum5 = this.randomNumber(18, 20);

    const testArr = testArray[0];

    resultFirstColumn.splice(randNum, 1, testArr[0]);
    resultSecondColumn.splice(randNum2, 1, testArr[1]);
    resultThirstColumn.splice(randNum3, 1, testArr[2]);
    resultFourthColumn.splice(randNum4, 1, testArr[3]);
    resultFiveColumn.splice(randNum5, 1, testArr[4]);

    this.setState({
      insertionIndex: [randNum, randNum2, randNum3, randNum4, randNum5]
    });

    return new Promise(resolve => setTimeout(() => resolve(), 1500));
  }

  async handleImage(setTimeOut) {
    const { testArray, testBol, insertionIndex } = this.state;

    const testArr = testArray[0];

    let i = 0;

    while (i < 5) {
      if (testArr[0 + i] !== testArr[0 + (i + 1)]) {
        break;
      }

      testBol[0 + i] = true;
      testBol[0 + (i + 1)] = true;

      i += 1;
      console.log(testBol);
    }
    this.setState({ line: true });
    this.setState({ testBol });
    this.setState({
      insertIndex: insertionIndex
    });

    return new Promise(resolve => setTimeout(() => resolve(), setTimeOut));
  }

  render() {
    const {
      testBol,
      line,
      result,
      resultFirstColumn,
      resultSecondColumn,
      resultThirstColumn,
      resultFourthColumn,
      resultFiveColumn,
      insertIndex,
      insertionIndex
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
          <div className={styles.spinnerContainer}>
          <div className={styles.lineTest}>
            <Line
              svgClass={styles.classLine}
              polylineClass={styles.classSvg}
              points="18 50, 18 50, 33 50, 47.5 15, 76 15"
              viewBox="0 5 100 100"
            />
            </div>
            {line === true ? (
              <HandleLines
                insertion1={insertIndex[0]}
                insertion2={insertIndex[1]}
              />
            ) : null}
            {/* 
              {testBol[3] ? (
                <Line
                  svgClass={styles.classLine}
                  polylineClass={styles.classSvg}
                  points="10 97,12 94, 18 94, 33 94, 76 94"
                  viewBox="0 5 100 100"
                />
              ) : null} */}
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
                return (
                  <img
                    src={images[num]}
                    alt=""
                    className={
                      index === insertIndex[0] && testBol[0] === true
                        ? styles.icon
                        : styles.iconStatic
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

export default SlotsGame;
