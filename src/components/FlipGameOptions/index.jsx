import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  InputNumber,
  ToggleButton,
  Button,
  Typography,
  MultiplyMaxButton,
  OnWinLoss
} from "components";
import UserContext from "containers/App/UserContext";
import betSound from "assets/bet-sound.mp3";
import Sound from "react-sound";
import Dice from "components/Icons/Dice";

import "./index.css";

export default class FlipGameOptions extends Component {
  static contextType = UserContext;

  static propTypes = {
    onBet: PropTypes.func.isRequired,
    disableControls: PropTypes.bool
  };

  static defaultProps = {
    disableControls: false
  };

  state = {
    type: "manual",
    betAmount: 0,
    side: "heads",
    bets: 1,
    profitStop: 0,
    lossStop: 0,
    onWin: null,
    onLoss: null,
    sound: false
  };

  handleType = type => {
    this.setState({ type });
  };

  handleSide = side => {
    this.setState({ side });
  };

  handleBetAmountChange = value => {
    this.setState({
        betAmount: value
    });
  };

  handleMultiply = value => {
    const { user } = this.context;
    const { betAmount } = this.state;
    let newAmount = betAmount;

    if (value === "max") {
      newAmount = user.balance;
    }

    if (value === "2") {
      newAmount = newAmount === 0 ? 0.01 : newAmount * 2;
    }

    if (value === "0.5") {
      newAmount = newAmount === 0.01 ? 0 : newAmount * 0.5;
    }

    if (newAmount > user.balance) {
      newAmount = user.balance;
    }

    this.setState({ betAmount: newAmount });
  };

    isBetValid = () => {
        const { user } = this.context;
        const { disableControls } = this.props;
        const { betAmount } = this.state;
        return (
        (user && betAmount > 0 && user.balance >= betAmount && !disableControls) || !user);
    };

    handleBet = () => {
        const { onBet } = this.props;

        if (this.isBetValid()) {
            this.setState({ sound: true });

            return onBet(this.state);
        }

        return null;
    };

  handleOnWin = value => {
    this.setState({ onWin: value });
  };

  handleOnLoss = value => {
    this.setState({ onLoss: value });
  };

  handleBets = value => {
    this.setState({ bets: value });
  };

  handleStopOnProfit = value => {
    this.setState({ profitStop: value });
  };

  handleStopOnLoss = value => {
    this.setState({ lossStop: value });
  };

  renderAuto = () => {
    const { bets, profitStop, lossStop, onWin, onLoss } = this.state;

    return (
      <div>
        <div styleName="element">
          <InputNumber
            name="bets"
            min={1}
            title="Number of Bets"
            value={bets}
            onChange={this.handleBets}
          />
        </div>
        <div styleName="element">
          <OnWinLoss value={onWin} title="On Win" onChange={this.handleOnWin} />
        </div>
        <div styleName="element">
          <OnWinLoss
            value={onLoss}
            title="On Loss"
            onChange={this.handleOnLoss}
          />
        </div>
        <div styleName="element">
          <InputNumber
            name="profit"
            step={0.01}
            title="Stop on Profit"
            icon="bitcoin"
            precision={2}
            value={profitStop}
            onChange={this.handleStopOnProfit}
          />
        </div>
        <div styleName="element">
          <InputNumber
            name="loss"
            step={0.01}
            precision={2}
            title="Stop on Loss"
            icon="bitcoin"
            value={lossStop}
            onChange={this.handleStopOnLoss}
          />
        </div>
      </div>
    );
  };

  renderManual = () => {
    const { betAmount } = this.state;

    return (
      <div>
        <div styleName="element">
          <InputNumber
            name="win-profit"
            title="Profit on Win"
            icon="bitcoin"
            precision={2}
            disabled
            value={betAmount}
          />
        </div>
      </div>
    );
  };

  renderSound = () => {
    const { sound } = this.state;
    const soundConfig = localStorage.getItem("sound");

    if (!sound || soundConfig !== "on") {
      return null;
    }

    return (
      <Sound
        onFinishedPlaying={this.handleSongFinishedPlaying}
        volume={100}
        url={betSound}
        playStatus="PLAYING"
        autoLoad
      />
    );
  };

  handleSongFinishedPlaying = () => {
    this.setState({ sound: false });
  };

  render() {
    const { type, betAmount, side } = this.state;
    const { user } = this.context;

    return (
      <div styleName="root">
        {this.renderSound()}
        <div styleName="toggle">
          <ToggleButton
            config={{
              left: { value: "manual", title: "Manual" },
              right: { value: "auto", title: "Auto", disabled : true}
            }}
            selected={type}
            size="full"
            differentBorders
            onSelect={this.handleType}
          />
        </div>
        <div styleName="amount">
          <Typography variant="small-body" weight="semi-bold" color="casper">
            Bet Amount
          </Typography>
          <div styleName="amount-container">
            <InputNumber
              name="amount"
              step={0.01}
              icon="bitcoin"
              max={user ? user.balance : null}
              precision={2}
              value={betAmount}
              onChange={this.handleBetAmountChange}
            />
            <MultiplyMaxButton onSelect={this.handleMultiply} />
          </div>
        </div>
        <div styleName="content">
          {type === "manual" ? this.renderManual() : this.renderAuto()}
        </div>

        <div styleName="side">
          <div styleName="label">
            <Typography variant="small-body" weight="semi-bold" color="casper">
              Choose Side
            </Typography>
          </div>
          <ToggleButton
            config={{
              left: { value: "heads", title: "Heads", color: "red" },
              right: { value: "tails", title: "Tails", color: "tree-poppy" }
            }}
            selected={side}
            differentBorders
            onSelect={this.handleSide}
            size="full"
          />
        </div>
        <div styleName="button">
          <Button
            fullWidth
            theme="primary"
            disabled={!this.isBetValid()}
            onClick={this.handleBet}
            animation={<Dice />}
          >
            <Typography weight="semi-bold" color="pickled-bluewood">
              {type === "manual" ? "Bet" : "Start AutoBet"}
            </Typography>
          </Button>
        </div>
      </div>
    );
  }
}
