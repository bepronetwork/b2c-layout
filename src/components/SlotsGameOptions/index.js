import React, { Component } from "react";
import PropTypes from "prop-types";
import { DropdownButton, Dropdown } from "react-bootstrap";
import Sound from "react-sound";
import { connect } from "react-redux";
import {
  InputNumber,
  ToggleButton,
  Button,
  Typography,
  OnWinLoss
} from "components";

import UserContext from "containers/App/UserContext";
import betSound from "assets/bet-sound.mp3";
import Dice from "components/Icons/Dice";
import Numbers from "./numberofLines";

import "./index.css";
import { CopyText } from "../../copy";

class SlotsGameOptions extends Component {
  static contextType = UserContext;

  state = {
    type: "manual",
    profitStop: 0,
    lossStop: 0,
    onWin: null,
    onLoss: null,
    sound: false
  };

  handleType = type => {
    this.setState({ type });
  };

  isBetValid = () => {
    const { user } = this.context;

    const { totalBet, disableControls } = this.props;

    return (totalBet > 0 && !disableControls) || !user;
  };

  handleBet = () => {
    const { onBet } = this.props;

    if (this.isBetValid()) {
      this.setState({ sound: true });

      return onBet();
    }

    return null;
  };

  renderAuto = () => {
    const { bets, profitStop, lossStop, onWin, onLoss } = this.state;
    const { ln } = this.props;
    const copy = CopyText.rouletteGameOptionsIndex[ln];

    return (
      <div>
        <div styleName="element">
          <InputNumber
            name="bets"
            title={copy.INDEX.INPUT_NUMBER.TITLE[0]}
            value={bets}
            onChange={this.handleBets}
          />
        </div>
        <div styleName="element">
          <OnWinLoss
            title={copy.INDEX.ON_WIN_LOSS.TITLE[0]}
            value={onWin}
            onChange={this.handleOnWin}
          />
        </div>
        <div styleName="element">
          <OnWinLoss
            title={copy.INDEX.ON_WIN_LOSS.TITLE[1]}
            value={onLoss}
            onChange={this.handleOnLoss}
          />
        </div>
        <div styleName="element">
          <InputNumber
            name="profit"
            step={0.01}
            title={copy.INDEX.INPUT_NUMBER.TITLE[1]}
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
            title={copy.INDEX.INPUT_NUMBER.TITLE[2]}
            icon="bitcoin"
            value={lossStop}
            onChange={this.handleStopOnLoss}
          />
        </div>
      </div>
    );
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
    const { type } = this.state;
    const { totalBet, ln, doubleDownBet } = this.props;
    const copy = CopyText.shared[ln];

    return (
      <div styleName="root">
        {this.renderSound()}

        <div styleName="toggle">
          <ToggleButton
            config={{
              left: { value: "manual", title: copy.MANUAL_NAME },
              right: { value: "auto", title: copy.AUTO_NAME, disabled: true }
            }}
            selected={type}
            size="full"
            differentBorders
            onSelect={this.handleType}
          />
        </div>

        <div styleName="bet-properties">
          <div styleName="element">
            <InputNumber
              name="amount"
              disabled
              icon="bitcoin"
              precision={6}
              value={totalBet}
              title={copy.TOTAL_BET_NAME}
            />
            <form onSubmit={this.handleSubmit}>
              <select onChange={this.handleChange} className="dropdown-input">
                {Numbers.map(items => {
                  return <option value="laranja">{items}</option>;
                })}
              </select>
            </form>
          </div>
          <div styleName="content">
            {type === "manual" ? null : this.renderAuto()}
          </div>
          <div styleName="button">
            <Button
              disabled={!this.isBetValid()}
              onClick={this.handleBet}
              fullWidth
              theme="primary"
            >
              <Typography weight="semi-bold" color="pickled-bluewood">
                {type === "manual" ? copy.BET_NAME : copy.AUTO_BET_NAME}
              </Typography>
            </Button>
          </div>
          <div styleName="button">
            <Button
              disabled={!this.isBetValid()}
              onClick={doubleDownBet}
              fullWidth
              theme="default"
              animation={<Dice />}
            >
              <Typography weight="semi-bold" color="pickled-bluewood">
                {copy.DOUBLE_DOWN_NAME}
              </Typography>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

SlotsGameOptions.propTypes = {
  onBet: PropTypes.func.isRequired,
  totalBet: PropTypes.number,
  disableControls: PropTypes.bool,
  doubleDownBet: PropTypes.string.isRequired
};

SlotsGameOptions.defaultProps = {
  totalBet: 0,
  disableControls: false
};

function mapStateToProps(state) {
  return {
    ln: state.language
  };
}

export default connect(mapStateToProps)(SlotsGameOptions);
