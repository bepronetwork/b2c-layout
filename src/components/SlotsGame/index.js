import React from "react";
import { zip } from "lodash";
import { Line1 } from "./FuncLines";
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
      testBol: new Array(200).fill(false)
    };
    this.finishHandler = this.finishHandler.bind(this);
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
    const { testBol } = this.state;

    this.clearCanvas();
    this.setState({ winner: false });
    this.setState({ testBol: new Array(200).fill(false) });

    await this.handleAnimations();
    await this.setWinnerState(true);
    await this.funcHandleMatriz();
    await this.concatMatrices();

    await this.handleAnimationResults();
    this.handleImages();

    console.log(testBol);
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

    return new Promise(resolve => setTimeout(() => resolve(), 1800));
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

  clearCanvas() {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  async handleAnimationResults() {
    const { testBol } = this.state;

    if (testBol[58] === true) {
      return this.finishHandler(18, 80, 60, 90, 65, 450, 65);
    }

    if (testBol[59] === true) {
      return this.finishHandler(19, 80, 120, 90, 125, 450, 125);
    }

    if (testBol[60] === true) {
      return this.finishHandler(20, 80, 188, 450, 188, 450, 188);
    }

    if (testBol[61] === true) {
      return this.finishHandler(21, 255, 90, 245, 450, 245);
    }

    return new Promise(resolve => setTimeout(() => resolve(), 1000));
  }

  async handleImages() {
    await this.handleImage(18);
    await this.handleImage(19);
    await this.handleImage(20);
    await this.handleImage(21);
  }

  async handleImage(startPosTest) {
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

    return new Promise(resolve => setTimeout(() => resolve(), 1000));
  }

  async finishHandler(canvas1, canvas2, canvas3, canvas4, canvas5, canvas6) {
    await Line1(
      "myCanvas",
      canvas1,
      canvas2,
      canvas3,
      canvas4,
      canvas5,
      canvas6
    );

    return new Promise(resolve => setTimeout(() => resolve(), 300));
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
        {/* <button onClick={this.handleLine} type="button">
          TESTE LINE
        </button> */}
        <div className={styles.topContainer}>
          <h1 className={styles.topContainerText}>Pagamento total: 0.000000</h1>
        </div>
        <div className={styles.rowContainer}>
          <div className={styles.columnContainer}>
            <div style={{ margin: "15px" }}>
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
            <div style={{ margin: "15px" }}>
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
            <div style={{ margin: "15px" }}>
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

          <div className={styles.spinnerContainer}>
            <canvas
              id="myCanvas"
              width="600px"
              height="300px"
              style={{ border: "1px solid #d3d3d3;" }}
              className={styles.lineTest}
            />
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
                    style={{
                      zIndex: testBol[index] === true ? 2 : 0,
                      transform:
                        testBol[index] === true ? "scale(1.2, 1.2)" : null,
                      transition: "transform 0,5s ease-in-out"
                    }}
                    src={images[num]}
                    alt=""
                    className={styles.icon}
                  />
                );
              })}
            </div>
            <div className={styles.separatedLine} />
            <div id="columnItem2" className={styles.columnSpinner}>
              {concatResult.slice(40, 80).map((num, index) => {
                return (
                  <img
                    style={{
                      zIndex: testBol[index + 40] === true ? 2 : 0,
                      transform:
                        testBol[index + 40] === true ? "scale(1.2, 1.2)" : null,
                      transition: "transform 0,5s ease-in-out"
                    }}
                    src={images[num]}
                    alt=""
                    className={styles.icon}
                  />
                );
              })}
            </div>
            <div className={styles.separatedLine} />
            <div id="columnItem3" className={styles.columnSpinner}>
              {concatResult.slice(80, 120).map((num, index) => {
                return (
                  <img
                    style={{
                      zIndex: testBol[index + 80] === true ? 2 : 0,
                      transform:
                        testBol[index + 80] === true ? "scale(1.2, 1.2)" : null,
                      transition: "transform 0,5s ease-in-out"
                    }}
                    src={images[num]}
                    alt=""
                    className={styles.icon}
                  />
                );
              })}
            </div>
            <div className={styles.separatedLine} />
            <div id="columnItem4" className={styles.columnSpinner}>
              {concatResult.slice(120, 160).map((num, index) => {
                return (
                  <img
                    style={{
                      zIndex: testBol[index + 120] === true ? 2 : 0,
                      transform:
                        testBol[index + 120] === true
                          ? "scale(1.2, 1.2)"
                          : null,
                      transition: "transform 0,5s ease-in-out"
                    }}
                    src={images[num]}
                    alt=""
                    className={styles.icon}
                  />
                );
              })}
            </div>
            <div className={styles.separatedLine} />
            <div id="columnItem5" className={styles.columnSpinner}>
              {concatResult.slice(160, 200).map((num, index) => {
                return (
                  <img
                    style={{
                      zIndex: testBol[index + 160] === true ? 2 : 0,
                      transform:
                        testBol[index + 160] === true
                          ? "scale(1.2, 1.2)"
                          : null,
                      transition: "transform 0,5s ease-in-out"
                    }}
                    src={images[num]}
                    alt=""
                    className={styles.icon}
                  />
                );
              })}
            </div>
          </div>
          <div className={styles.columnContainer}>
            <div style={{ margin: "15px" }}>
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

            <div style={{ margin: "15px" }}>
              {numberOfLines.map(lines => {
                if (lines >= 19 && lines <= 21) {
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
                if (lines >= 22 && lines <= 24) {
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
