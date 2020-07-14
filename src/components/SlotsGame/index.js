import React from "react";
import { zip } from "lodash";

import Line from "components/SlotsLines";
import styles from "./index.css";
import numberOfLines from "../SlotsGameOptions/numberofLines";
import images from "./Spinner/images";

function WinningSound() {
  return (
    <audio autoPlay="autoplay" className="player" preload="false">
      <source src="" />
    </audio>
  );
}

class SlotsGame extends React.Component {
  static matches = [];

  constructor(props) {
    super(props);
    this.state = {
      winner: false,
      matrixResult: [],
      concatResult: [],
      testBol: new Array(200).fill(false),
      testArray: [1, 1, 2, 3, 5]
    };
    // this.finishHandler = this.finishHandler.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount() {
    const resultRow = this.randomTable(5, 40);

    const tMat = zip(...resultRow);

    console.log(tMat);

    await this.setState({ matrixResult: tMat });
    await this.concatMatrices();
  }

  randomTable = (rows, cols) =>
    Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.floor(Math.random() * 8))
    );

  handleClick = async () => {
    const { testBol, concatResult } = this.state;

    this.setState({ winner: false });
    this.setState({ testBol: new Array(200).fill(false) });

    await this.handleAnimations();
    await this.funcHandleMatriz();
    await this.concatMatrices();
    await this.testeItem(0);

    await this.handleAnimationResults();
    await this.handleImages();

    await this.setWinnerState(true);
    console.log(testBol);
    console.log(concatResult);
  };

  funcHandleMatriz = async () => {
    const resultRow = this.randomTable(5, 40);

    console.log(resultRow);

    const tMat = zip(...resultRow);

    console.log(tMat);

    return this.setState({ matrixResult: tMat });
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

  setWinnerState = async winnerState => {
    this.setState({ winner: winnerState });
  };

  concatMatrices = async () => {
    const { matrixResult } = this.state;

    const resultConcatFinal = [].concat(...matrixResult);

    this.setState({ concatResult: resultConcatFinal });

    console.log(resultConcatFinal);

    return new Promise(resolve => setTimeout(() => resolve(), 1000));
  };

  async testeItem(resultIndex) {
    const { concatResult, testArray } = this.state;

    const result = concatResult.splice(58, 0, testArray[resultIndex]);

    console.log(result);
  }

  async handleAnimationResults() {
    const { testBol } = this.state;

    if (testBol[58] === true) {
      return (
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="styles__SVG-sc-1t73zzd-4 iBHven"
        >
          <polyline
            points="12 15, 31 15, 50 50, 69 85, 87 50, 100 42"
            shapeRendering="geometricPrecision"
            className="styles__Line-sc-1t73zzd-5 gwXqok"
          />
        </svg>
      );
    }

    return new Promise(resolve => setTimeout(() => resolve(), 1000));
  }

  async handleImages() {
    await this.handleImage(18, 500);
    await this.handleImage(19, 1000);
    await this.handleImage(20, 1500);
  }

  async handleImage(startPosTest, setTimeOut) {
    const { concatResult, testBol } = this.state;

    const startPos = startPosTest;

    let i = 0;

    while (i < 5) {
      if (
        concatResult[startPos + i * 40] !==
        concatResult[startPos + (i + 1) * 40]
      ) {
        break;
      }

      testBol[startPos + i * 40] = true;
      testBol[startPos + (i + 1) * 40] = true;

      i += 1;
    }
    this.setState({ testBol });

    console.log(i);

    return new Promise(resolve => setTimeout(() => resolve(), setTimeOut));
  }

  render() {
    const { winner, concatResult, testBol } = this.state;
    let winningSound = null;

    if (winner) {
      winningSound = <WinningSound />;
    }

    return (
      <div className={styles.containerInit}>
        {winningSound}
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
              {testBol[59] ? (
                <Line
                  svgClass={styles.classLine}
                  polylineClass={styles.classSvg}
                  points="9 55,12 55, 18 55, 33 55, 76 55"
                  viewBox="0 5 100 100"
                />
              ) : null}

              {testBol[60] ? (
                <Line
                  svgClass={styles.classLine}
                  polylineClass={styles.classSvg}
                  points="10 97,12 94, 18 94, 33 94, 76 94"
                  viewBox="0 5 100 100"
                />
              ) : null}
            </div>
            {testBol[58] ||
            testBol[59] ||
            testBol[60] ||
            testBol[61] === true ? (
              <div className={styles.backgroundTransparence} />
            ) : null}
            {winner === true ? (
              <div className={styles.resultCard}>
                <div className={styles.columnContainer}>
                  <p className={styles.resultCardText}>0,25x</p>
                  <p className={styles.resultCardText}>0,0000000</p>
                </div>
              </div>
            ) : null}
            <div id="columnItem" className={styles.columnSpinner}>
              {concatResult.slice(0, 40).map((num, index) => {
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
              {concatResult.slice(40, 80).map((num, index) => {
                return (
                  <img
                    src={images[num]}
                    alt=""
                    className={
                      testBol[index + 40] === true
                        ? styles.icon
                        : styles.iconStatic
                    }
                  />
                );
              })}
            </div>
            <div className={styles.separatedLine} />
            <div id="columnItem3" className={styles.columnSpinner}>
              {concatResult.slice(80, 120).map((num, index) => {
                return (
                  <img
                    src={images[num]}
                    alt=""
                    className={
                      testBol[index + 80] === true
                        ? styles.icon
                        : styles.iconStatic
                    }
                  />
                );
              })}
            </div>
            <div className={styles.separatedLine} />
            <div id="columnItem4" className={styles.columnSpinner}>
              {concatResult.slice(120, 160).map((num, index) => {
                return (
                  <img
                    src={images[num]}
                    alt=""
                    className={
                      testBol[index + 120] === true
                        ? styles.icon
                        : styles.iconStatic
                    }
                  />
                );
              })}
            </div>
            <div className={styles.separatedLine} />
            <div id="columnItem5" className={styles.columnSpinner}>
              {concatResult.slice(160, 200).map((num, index) => {
                return (
                  <img
                    src={images[num]}
                    alt=""
                    className={
                      testBol[index + 160] === true
                        ? styles.icon
                        : styles.iconStatic
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
