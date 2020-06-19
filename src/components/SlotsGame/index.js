import React from "react";

import "./styles.css";
import Spinner from "./Spinner";

function RepeatButton(onClick) {
  return (
    <button
      aria-label="Play again."
      type="button"
      id="repeatButton"
      onClick={onClick}
    />
  );
}

function WinningSound() {
  return (
    <audio autoPlay="autoplay" className="player" preload="false">
      <source src="https://andyhoffman.codes/random-assets/img/slots/winning_slot.wav" />
    </audio>
  );
}

class SlotsGame extends React.Component {
  static loser = [
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

  matches = [];

  constructor(props) {
    super(props);
    this.state = {
      winner: null
    };
    this.finishHandler = this.finishHandler.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ winner: null });
    this.emptyArray();
    this.childSpinner.forceUpdateHandler();
  }

  finishHandler(value) {
    this.matches.push(value);

    if (this.matches.length === 3) {
      const first = this.matches[0];
      const results = this.matches.every(match => match === first);

      this.setState({ winner: results });
    }
  }

  emptyArray() {
    SlotsGame.matches = [];
  }

  render() {
    const { winner } = this.state;
    const getLoser = () => {
      return SlotsGame.loser[
        Math.floor(Math.random() * SlotsGame.loser.length)
      ];
    };
    let repeatButton = null;
    let winningSound = null;

    if (winner !== null) {
      repeatButton = <RepeatButton onClick={this.handleClick} />;
    }

    if (winner) {
      winningSound = <WinningSound />;
    }

    return (
      <div>
        {winningSound}
        <h1 style={{ color: "white" }}>
          <span>
            {winner === null
              ? "Waiting…"
              : winner
              ? "🤑 Pure skill! 🤑"
              : getLoser()}
          </span>
        </h1>

        <div className="spinner-container">
          <Spinner
            onFinish={this.finishHandler}
            ref={child => {
              this.childSpinner = child;
            }}
            timer="1000"
          />
          <Spinner
            onFinish={this.finishHandler}
            ref={child => {
              this.childSpinner = child;
            }}
            timer="1400"
          />
          <Spinner
            onFinish={this.finishHandler}
            ref={child => {
              this.childSpinner = child;
            }}
            timer="2200"
          />
          <Spinner
            onFinish={this.finishHandler}
            ref={child => {
              this.childSpinner = child;
            }}
            timer="2800"
          />
          <div className="gradient-fade" />
        </div>
        {repeatButton}
      </div>
    );
  }
}

export default SlotsGame;
