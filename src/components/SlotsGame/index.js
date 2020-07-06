import React from "react";
// import { random } from "lodash";
// import { array } from "prop-types";
import { Line1, Line2, Line3 } from "./FuncLines";
import Spinner from "./Spinner";
import styles from "./index.css";
import numberOfLines from "../SlotsGameOptions/numberofLines";
import images from "./Spinner/images";

function WinningSound() {
  return (
    <audio autoPlay="autoplay" className="player" preload="false">
      <source src="https://andyhoffman.codes/random-assets/img/slots/winning_slot.wav" />
    </audio>
  );
}

class SlotsGame extends React.Component {
  static matches = [];

  constructor(props) {
    super(props);
    this.state = {
      winner: null,
      matrixResult: [],
      concatResult: []
    };
    this.finishHandler = this.finishHandler.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount() {
    const resultRow = this.randomTable(4, 6);

    await this.setState({ matrixResult: resultRow });
    await this.concatMatrices();
  }

  concatMatrices = () => {
    const { matrixResult } = this.state;

    const resultConcatFinal = [].concat(...matrixResult);

    this.setState({ concatResult: resultConcatFinal });
  };

  randomTable = (rows, cols) =>
    Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.floor(Math.random() * 8))
    );

  handleClick = async () => {
    const { matrixResult, concatResult } = this.state;

    this.setState({ winner: null });
    this.emptyArray();
    const resultRow = this.randomTable(4, 6);

    this.handleAnimation();
    this.finishHandler();

    await this.setState({ matrixResult: resultRow });
    const resultConcatFinal = [].concat(...matrixResult);

    await this.setState({ concatResult: resultConcatFinal });

    console.log(concatResult);
  };

  handleLine = () => {
    const c = document.getElementById("myCanvas");
    const ctx = c.getContext("2d");

    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.strokeStyle = "white";
    ctx.moveTo(65, 190);
    ctx.lineTo(450, 190);
    ctx.stroke(); // Draw it
  };

  handleLine2 = () => {
    Line2("myCanvas");
  };

  handleAnimation = () => {
    document
      .getElementById("columnItem")
      .animate(
        [
          { transform: "translate3D(0, 0, 0)" },
          { transform: "translate3D(0, -300px, 0)" }
        ],
        {
          duration: 1000,
          iterations: Infinity
        }
      );
  };

  emptyArray() {
    SlotsGame.matches = [];
  }

  finishHandler() {
    const { concatResult } = this.state;

    if (concatResult[0] === concatResult[5]) {
      return Line1("myCanvas");
    }

    if (concatResult[1] === concatResult[6]) {
      return Line2("myCanvas");
    }

    if (concatResult[2] === concatResult[7]) {
      return Line3("myCanvas", 65, 190, 450, 190);
    }

    if (concatResult[3] === concatResult[8]) {
      return Line3("myCanvas", 65, 265, 450, 265);
    }
  }

  render() {
    const { winner, concatResult } = this.state;
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
        <button onClick={this.handleLine} type="button">
          TESTE LINE
        </button>
        <button onClick={this.handleLine2} type="button">
          TESTE LINE
        </button>
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
            {/* <Spinner
              onFinish={this.finishHandler}
              ref={child => {
                this.child1 = child;
              }}
              timer="1000"
              concatResult={concatResult}
              numberOne={0}
              numberTwo={4}
            /> */}
            <div id="columnItem" className={styles.columnContainer}>
              {concatResult.slice(0, 4).map(num => {
                return (
                  // <img src={images[num]} alt="" className={styles.icon} />
                  <img src={images[num]} alt="" className={styles.icon} />
                );
              })}
            </div>
            <div className={styles.separatedLine} />
            <div className={styles.columnContainer}>
              {concatResult.slice(5, 9).map(num => {
                return <img src={images[num]} alt="" className={styles.icon} />;
              })}
            </div>
            <div className={styles.separatedLine} />
            <div className={styles.columnContainer}>
              {concatResult.slice(10, 14).map(num => {
                return <img src={images[num]} alt="" className={styles.icon} />;
              })}
            </div>
            <div className={styles.separatedLine} />
            <div className={styles.columnContainer}>
              {concatResult.slice(15, 19).map(num => {
                return <img src={images[num]} alt="" className={styles.icon} />;
              })}
            </div>
            <div className={styles.separatedLine} />
            <div className={styles.columnContainer}>
              {concatResult.slice(20, 24).map(num => {
                return <img src={images[num]} alt="" className={styles.icon} />;
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
