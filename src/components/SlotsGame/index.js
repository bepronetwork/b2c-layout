import React from "react";
// import { random } from "lodash";
// import { array } from "prop-types";
// import Spinner from "./Spinner";
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

    await this.setState({ matrixResult: resultRow });

    const resultConcatFinal = [].concat(...matrixResult);

    this.setState({ concatResult: resultConcatFinal });

    console.log(concatResult);
    console.log(matrixResult);
  };

  handleLine = () => {
    const c = document.getElementById("myCanvas");
    const ctx = c.getContext("2d");

    ctx.beginPath();
    ctx.lineWidth = "5";
    ctx.strokeStyle = "green"; // Green path
    ctx.moveTo(0, 75);
    ctx.lineTo(250, 75);
    ctx.stroke(); // Draw it
  };

  handleLine2 = () => {
    const c = document.getElementById("myCanvas");
    const ctx = c.getContext("2d");

    ctx.beginPath();
    ctx.lineWidth = "5";
    ctx.strokeStyle = "green"; // Green path
    ctx.moveTo(100, 75);
    ctx.lineTo(350, 344);
    ctx.stroke(); // Draw it
  };

  finishHandler(value) {
    SlotsGame.matches.push(value);

    if (SlotsGame.matches.length === 5) {
      const first = SlotsGame.matches[0];
      const results = SlotsGame.matches.every(match => match === first);

      this.setState({ winner: results });
    }
  }

  emptyArray() {
    SlotsGame.matches = [];
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
          </div>

          <div className={styles.spinnerContainer}>
            <canvas
              id="myCanvas"
              width="300"
              height="150"
              style={{ border: "1px solid #d3d3d3;" }}
              className={styles.lineTest}
            />
            <div className={styles.rowContainer}>
              <div className={styles.columnContainer}>
                {concatResult.slice(0, 4).map(num => {
                  return (
                    // <img src={images[num]} alt="" className={styles.icon} />
                    <p>{num}</p>
                  );
                })}
              </div>
              <div className={styles.separatedLine} />
            </div>

            <div className={styles.rowContainer}>
              <div className={styles.columnContainer}>
                {concatResult.slice(5, 9).map(num => {
                  return <p>{num}</p>;
                })}
              </div>
              <div className={styles.separatedLine} />
            </div>

            <div className={styles.rowContainer}>
              <div className={styles.columnContainer}>
                {concatResult.slice(10, 14).map(num => {
                  return <p>{num}</p>;
                })}
              </div>
              <div className={styles.separatedLine} />
            </div>

            <div className={styles.rowContainer}>
              <div className={styles.columnContainer}>
                {concatResult.slice(15, 19).map(num => {
                  return <p>{num}</p>;
                })}
              </div>
              <div className={styles.separatedLine} />
            </div>

            <div className={styles.rowContainer}>
              <div className={styles.columnContainer}>
                {concatResult.slice(20, 24).map(num => {
                  return <p>{num}</p>;
                })}
              </div>
              <div className={styles.separatedLine} />
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
