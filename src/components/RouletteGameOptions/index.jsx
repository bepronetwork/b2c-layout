import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  InputNumber,
  ToggleButton,
  Button,
  Typography,
  OnWinLoss,
  ChipValue
} from "components";
import UserContext from "containers/App/UserContext";
import Sound from "react-sound";
import betSound from "assets/bet-sound.mp3";
import Dice from "components/Icons/Dice";
import { connect } from "react-redux";
import delay from "delay";
import { Numbers } from "../../lib/ethereum/lib";
import { isUserSet } from "../../lib/helpers";
import _ from "lodash";
import "./index.css";
import { CopyText } from "../../copy";

class RouletteGameOptions extends Component {
  static contextType = UserContext;

  static propTypes = {
    onBet: PropTypes.func.isRequired,
    onChangeChip: PropTypes.func.isRequired,
    totalBet: PropTypes.number,
    disableControls: PropTypes.bool
  };

  static defaultProps = {
    totalBet: 0,
    disableControls: false
  };

  state = {
    type: "manual",
    profitStop: 0,
    lossStop: 0,
    onWin: null,
    onLoss: null,
    sound: false,
    isAutoBetting: false
  };

  handleType = type => {
    this.setState({ type });
  };

  isBetValid = () => {
    const { user } = this.context;
    const { isAutoBetting } = this.state;
    const { totalBet, disableControls } = this.props;

    return (
      (totalBet > 0 && !disableControls && isAutoBetting == false) || !user
    );
  };

  handleBet = async callback => {
    const { onBet, profile } = this.props;
    const {
      amount,
      type,
      bets,
      profitStop,
      lossStop,
      onWin,
      onLoss
    } = this.state;
    var res;
    if (this.isBetValid()) {
      // to be completed with the other options
      this.setState({ sound: true });
      switch (type) {
        case "manual": {
          res = await onBet({ amount });
          break;
        }
        case "auto": {
          if (!isUserSet(profile)) {
            return null;
          }
          this.setState({ isAutoBetting: true });
          var totalProfit = 0,
            totalLoss = 0,
            lastBet = 0,
            wasWon = 0;
          var betAmount = amount;
          for (var i = 0; i < bets; i++) {
            if (
              (profitStop == 0 || totalProfit <= profitStop) && // Stop Profit
              (lossStop == 0 || totalLoss <= lossStop) // Stop Loss
            ) {
              if (i != 0) {
                await delay(3 * 1000);
              }
              const res = await this.betAction({ amount: betAmount });
              if (!_.isEmpty(res)) {
                let { winAmount } = res;
                totalProfit += winAmount - betAmount;
                totalLoss += winAmount == 0 ? -Math.abs(betAmount) : 0;
                wasWon = winAmount != 0;
                lastBet = betAmount;
                if (onWin && wasWon) {
                  betAmount += Numbers.toFloat((betAmount * onWin) / 100);
                }
                if (onLoss && !wasWon) {
                  betAmount += Numbers.toFloat((betAmount * onLoss) / 100);
                }
                await delay(4 * 1000);
                this.setState({ bets: bets - (i + 1), amount: betAmount });
              } else {
                break;
              }
            }
          }
          this.setState({ isAutoBetting: false });
          break;
        }
      }
    }
  };

  betAction = ({ amount }) => {
    const { onBet } = this.props;
    return new Promise(async (resolve, reject) => {
      try {
        let res = await onBet({ amount });
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
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
    const { onChangeChip, totalBet, ln, doubleDownBet } = this.props;
    const copy = CopyText.shared[ln];

    return (
      <div styleName="root">
        {this.renderSound()}

        <div styleName="toggle">
          <ToggleButton
            config={{
              left: { value: "manual", title: copy.MANUAL_NAME },
              right: { value: "auto", title: copy.AUTO_NAME }
            }}
            selected={type}
            size="full"
            differentBorders
            onSelect={this.handleType}
          />
        </div>

        <div styleName="bet-properties">
          <ChipValue onChangeChip={onChangeChip} totalBet={totalBet} />
          <div styleName="element">
            <InputNumber
              name="amount"
              disabled
              icon="bitcoin"
              precision={6}
              value={totalBet}
              title={copy.TOTAL_BET_NAME}
            />
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
              animation={<Dice />}
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

function mapStateToProps(state) {
  return {
    ln: state.language
  };
}

export default connect(mapStateToProps)(RouletteGameOptions);
