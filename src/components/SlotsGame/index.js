import React from "react";
import { Line1, Line3 } from "./FuncLines";
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
    const resultRow = this.randomTable(15, 15);

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

    this.clearCanvas();

    this.handleAnimation("columnItem", 0);
    this.handleAnimation("columnItem2", 500);
    this.handleAnimation("columnItem3", 1000);
    this.handleAnimation("columnItem4", 1500);
    await this.handleAnimation("columnItem5", 2000);
    this.finishHandler();

    const resultConcatFinal = [].concat(...matrixResult);

    await this.setState({ concatResult: resultConcatFinal });

    console.log(concatResult);
  };

  handleLine = () => {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.strokeStyle = "white";
    ctx.moveTo(65, 220);
    ctx.lineTo(450, 220);
  };

  handleLine2 = () => {
    
  };

  handleAnimation = async (spinnerColumn, delayTime) => {
    const box = document.getElementById(spinnerColumn);

    await box.animate(
      [
        { transform: "translate3D(0, 0, 0)" },
        { transform: "translate3D(0, -30px, 0)" },
        { transform: "translate3D(0, 600px, 0)" }
      ],
      {
        duration: 1000,
        iterations: 1,
        delay: delayTime
      }
    );

    const resultRow = this.randomTable(15, 15);

    this.setState({ matrixResult: resultRow });
  };

  clearCanvas() {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  emptyArray() {
    SlotsGame.matches = [];
  }

  finishHandler() {
    const { concatResult } = this.state;

    if (concatResult[0] === concatResult[5]) {
      return Line1("myCanvas", 80, 60, 90, 65, 450, 65);
    }

    if (concatResult[1] === concatResult[6]) {
      return Line1("myCanvas", 80, 120, 90, 125, 450, 125);
    }

    if (concatResult[2] === concatResult[7]) {
      return Line3("myCanvas", 80, 190, 450, 190);
    }

    if (concatResult[3] === concatResult[8]) {
      return Line1("myCanvas", 80, 255, 90, 245, 450, 245);
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
            <div id="columnItem" className={styles.columnSpinner}>
              {concatResult.slice(0, 40).map(num => {
                return (
                  // <img src={images[num]} alt="" className={styles.icon} />
                  <img src={images[num]} alt="" className={styles.icon} />
                );
              })}
            </div>
            <div className={styles.separatedLine} />
            <div id="columnItem2" className={styles.columnSpinner}>
              {concatResult.slice(41, 81).map(num => {
                return <img src={images[num]} alt="" className={styles.icon} />;
              })}
            </div>
            <div className={styles.separatedLine} />
            <div id="columnItem3" className={styles.columnSpinner}>
              {concatResult.slice(82, 122).map(num => {
                return <img src={images[num]} alt="" className={styles.icon} />;
              })}
            </div>
            <div className={styles.separatedLine} />
            <div id="columnItem4" className={styles.columnSpinner}>
              {concatResult.slice(123, 163).map(num => {
                return <img src={images[num]} alt="" className={styles.icon} />;
              })}
            </div>
            <div className={styles.separatedLine} />
            <div id="columnItem5" className={styles.columnSpinner}>
              {concatResult.slice(164, 204).map(num => {
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
