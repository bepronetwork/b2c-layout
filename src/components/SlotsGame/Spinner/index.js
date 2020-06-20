import React from "react";
import PropTypes from "prop-types";

import styles from "../index.css";

class Spinner extends React.Component {
  iconHeight = 188;

  multiplier = Math.floor(Math.random() * (4 - 1) + 1);

  start = this.setStartPosition();

  speed = Spinner.iconHeight * this.multiplier;

  constructor(props) {
    super(props);
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
  }

  state = {
    position: 100
  };

  componentDidMount() {
    const { timer } = this.props;

    clearInterval(this.timer);

    this.setState({
      position: this.start,
      timeRemaining: timer
    });

    this.timer = setInterval(() => {
      this.tick();
    }, 100);
  }

  setStartPosition() {
    return Math.floor(Math.random() * 9) * Spinner.iconHeight * -1;
  }

  getSymbolFromPosition() {
    const { timer, onFinish } = this.props;
    const totalSymbols = 9;
    const maxPosition = Spinner.iconHeight * (totalSymbols - 1) * -1;
    const moved = (timer / 100) * this.multiplier;
    const startPosition = this.start;
    let currentPosition = startPosition;

    for (let i = 0; i < moved; i++) {
      currentPosition -= Spinner.iconHeight;

      if (currentPosition < maxPosition) {
        currentPosition = 0;
      }
    }

    onFinish(currentPosition);
  }

  moveBackground() {
    const { position, timeRemaining } = this.state;

    this.setState({
      position: position - this.speed,
      timeRemaining: timeRemaining - 100
    });
  }

  reset() {
    const { timer } = this.props;

    if (this.timer) {
      clearInterval(this.timer);
    }

    this.start = this.setStartPosition();

    this.setState({
      position: this.start,
      timeRemaining: timer
    });

    this.timer = setInterval(() => {
      this.tick();
    }, 100);
  }

  forceUpdateHandler() {
    this.reset();
  }

  tick() {
    const { timeRemaining } = this.state;

    if (timeRemaining <= 0) {
      clearInterval(this.timer);
      this.getSymbolFromPosition();
    } else {
      this.moveBackground();
    }
  }

  render() {
    const { position } = this.state;

    return (
      <div
        style={{ backgroundPosition: `0px ${position}px` }}
        className={styles.icons}
      />
    );
  }
}

Spinner.propTypes = {
  timer: PropTypes.string.isRequired,
  onFinish: PropTypes.func.isRequired
};

export default Spinner;
