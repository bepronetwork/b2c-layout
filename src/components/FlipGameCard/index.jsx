import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Dollar from "components/Icons/Dollar";
import Bitcoin from "components/Icons/Bitcoin";
import { Typography, InputNumber } from "components";
import Sound from "react-sound";
import { upperFirst } from "lodash";
import UserContext from "containers/App/UserContext";
import coinSound from "assets/coin-sound.mp3";
import winSound from "assets/win-sound.mp3";
import loseSound from "assets/lose-sound.mp3";

import "./index.css";

export default class FlipGameCard extends Component {
  static contextType = UserContext;

  static propTypes = {
    flipResult: PropTypes.string,
    hasWon: PropTypes.bool,
    updateBalance: PropTypes.func.isRequired,
    onResult: PropTypes.func.isRequired
  };

  static defaultProps = {
    flipResult: null,
    hasWon: null
  };

  constructor(props) {
    super(props);

    this.state = {
      isCoinSpinning: false,
      result: null
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.flipResult && state.result !== props.flipResult) {
      return {
        result: props.flipResult
      };
    }

    if (state.result && props.flipResult) {
      return {
        result: null
      };
    }

    return null;
  }

  renderWinLost = () => {
    const { flipResult, hasWon } = this.props;

    return hasWon
      ? `You won, ${upperFirst(flipResult)}`
      : `You lost, ${upperFirst(flipResult)}`;
  };

  renderCoinSound = () => {
    const { flipResult } = this.props;
    const { isCoinSpinning } = this.state;

    if (!flipResult || !isCoinSpinning) {
      return null;
    }

    return <Sound volume={100} url={coinSound} playStatus="PLAYING" autoLoad />;
  };

  renderWinLoseSound = () => {
    const { isCoinSpinning } = this.state;
    const { flipResult, hasWon } = this.props;

    if (isCoinSpinning || !flipResult) {
      return null;
    }

    return (
      <Sound
        volume={100}
        url={hasWon ? winSound : loseSound}
        playStatus="PLAYING"
        autoLoad
        onFinishedPlaying={this.handleWinLoseFinished}
      />
    );
  };

  handleWinLoseFinished = () => {
    const { onResult } = this.props;

    onResult();
  };

  handleAnimationEnd = () => {
    this.setState({ isCoinSpinning: false }, () => {
      const { updateBalance } = this.props;

      updateBalance();
    });
  };

  handleAnimationStart = () => {
    this.setState({ isCoinSpinning: true });
  };

  render() {
    const { flipResult } = this.props;

    const coinStyles = classNames(
      "coin",
      flipResult
        ? {
            [flipResult]: true
          }
        : null
    );

    return (
      <div styleName="root">
        {this.renderCoinSound()}
        {this.renderWinLoseSound()}
        <div styleName="flip-container">
          <div
            styleName={coinStyles}
            onAnimationStart={this.handleAnimationStart}
            onAnimationEnd={this.handleAnimationEnd}
          >
            <div styleName="side-heads">
              <Bitcoin />
            </div>
            <div styleName="side-tails">
              <Bitcoin />
            </div>
          </div>
          <div styleName={flipResult ? "show-label" : "label"}>
            <Typography variant="h3" color="white">
              {flipResult ? this.renderWinLost() : ""}
            </Typography>
          </div>
        </div>
        <div styleName="values">
          <InputNumber
            name="payout"
            title="Payout"
            icon="cross"
            value={Number("2.0000")}
            disabled
          />

          <InputNumber
            name="chance"
            unit="%"
            title="Win Chance"
            disabled
            value={50}
          />
        </div>
      </div>
    );
  }
}
