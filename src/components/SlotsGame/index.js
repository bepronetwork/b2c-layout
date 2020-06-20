import React from "react";
import Spinner from "./Spinner";
import styles from "./index.css";

function WinningSound() {
  return (
    <audio autoPlay="autoplay" className="player" preload="false">
      <source src="https://andyhoffman.codes/random-assets/img/slots/winning_slot.wav" />
    </audio>
  );
}

class SlotsGame extends React.Component {
  static matches = [];

  loser = [
    "Not quite",
    "Stop gambling",
    "Hey, you lost!",
    "Ouch! I felt that",
    "Don't beat yourself up",
    "There goes the college fund",
    "I have a cat. You have a loss",
    "You're awesome at losing",
    "Coding is hard",
    "Don't hate the coder"
  ];

  constructor(props) {
    super(props);
    this.state = {
      winner: null
    };
    this.finishHandler = this.finishHandler.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = () => {
    this.setState({ winner: null });
    this.emptyArray();
    this.child1.forceUpdateHandler();
    this.child2.forceUpdateHandler();
    this.child3.forceUpdateHandler();
    this.child4.forceUpdateHandler();
    this.child5.forceUpdateHandler();
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
    const { winner } = this.state;
    let winningSound = null;

    if (winner) {
      winningSound = <WinningSound />;
    }

    return (
      <div className={styles.containerInit}>
        {winningSound}
        <div className={styles.topContainer}>
          <h1 className={styles.topContainerText}>Pagamento total: 0.000000</h1>
        </div>
        <div className={styles.spinnerContainer}>
          <Spinner
            onFinish={this.finishHandler}
            ref={child => {
              this.child1 = child;
            }}
            timer="1000"
          />
          <div className={styles.separatedLine} />
          <Spinner
            onFinish={this.finishHandler}
            ref={child => {
              this.child2 = child;
            }}
            timer="1400"
          />
          <div className={styles.separatedLine} />
          <Spinner
            onFinish={this.finishHandler}
            ref={child => {
              this.child3 = child;
            }}
            timer="2200"
          />
          <div className={styles.separatedLine} />
          <Spinner
            onFinish={this.finishHandler}
            ref={child => {
              this.child4 = child;
            }}
            timer="3000"
          />
          <div className={styles.separatedLine} />
          <Spinner
            onFinish={this.finishHandler}
            ref={child => {
              this.child5 = child;
            }}
            timer="3800"
          />
        </div>
        {winner === null ? null : (
          <button
            className="repeat-button"
            type="button"
            onClick={this.handleClick}
          />
        )}
      </div>
    );
  }
}

export default SlotsGame;
