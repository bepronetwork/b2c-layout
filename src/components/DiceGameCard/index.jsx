import React, { Component } from "react";
import PropTypes from "prop-types";
import { InputNumber, Slider, ButtonIcon } from "components";
import { startCase } from "lodash";

import "./index.css";

const minPayout = 1.0102;
const maxPayout = 49.5;
const middlePayout = 2;
const middleRoll = 50;

export default class DiceGameCard extends Component {
  static propTypes = {
    result: PropTypes.number,
    disableControls: PropTypes.bool,
    onResultAnimation: PropTypes.func.isRequired,
    onChangeRollAndRollType: PropTypes.func.isRequired
  };

  static defaultProps = {
    result: null,
    disableControls: false
  };

  constructor(props) {
    super(props);

    this.state = {
      rollType: "over",
      roll: Number("50"),
      chance: Number("49.5000"),
      payout: Number("2.0000"),
      result: props.result
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.result && nextProps.result !== prevState.result) {
      let history = localStorage.getItem("diceHistory");
      const win = !!(
        (nextProps.result >= prevState.roll && prevState.rollType === "over") ||
        (nextProps.result < prevState.roll && prevState.rollType === "under")
      );

      history = history ? JSON.parse(history) : [];
      history.unshift({ value: nextProps.result, win });

      localStorage.setItem("diceHistory", JSON.stringify(history));

      return {
        result: nextProps.result
      };
    }

    return null;
  }

  handlePayout = payout => {
    const { onChangeRollAndRollType } = this.props;
    const { rollType } = this.state;

    let newRoll = 0;

    if (payout === middlePayout) {
      newRoll = middleRoll;
    } else {
      newRoll =
        rollType === "over"
          ? (middleRoll * middlePayout - 100 * payout) / (payout * -1)
          : (middleRoll * middlePayout) / payout;
    }

    this.setState({
      payout,
      roll: newRoll,
      chance: rollType === "over" ? 100 - newRoll : newRoll
    });

    onChangeRollAndRollType(newRoll, rollType);
  };

    handleChance = value => {
        const { onChangeRollAndRollType } = this.props;
        const { rollType } = this.state;

        const newRoll = rollType === "over" ? 100 - value : value;

        const payout = this.getPayout(newRoll);

        this.setState({
            chance: value,
            roll: newRoll,
            payout
        });

        onChangeRollAndRollType(newRoll, rollType);
    };

    handleRoll = () => {
        const { onChangeRollAndRollType } = this.props;
        const { rollType, roll } = this.state;

        const newRollType = rollType === "over" ? "under" : "over";
        const newRoll = 100 - roll;

        this.setState({
            rollType: newRollType,
            roll: newRoll,
            chance: rollType === "over" ? newRoll : roll
        });

        onChangeRollAndRollType(newRoll, newRollType);
    };

    getPayout = roll => {
        const { rollType } = this.state;
        let payout = 0;

        if (roll === middleRoll) {
        payout = middlePayout;
        } else {
        payout =
            rollType === "over"
            ? (middleRoll * middlePayout) / (100 - roll)
            : (middleRoll * middlePayout) / roll;
        }

        return payout;
    };

    handleSlider = value => {
        const { onChangeRollAndRollType } = this.props;
        const { rollType } = this.state;
        const payout = this.getPayout(value);

        this.setState({
        roll: value,
        chance: rollType === "over" ? 100 - value : value,
        payout
        });
        onChangeRollAndRollType(value, rollType);
    };

  getPayoutStep = () => {
        const { roll, rollType } = this.state;

        if (rollType === "over") {
        if (roll < 50) return 0.1;

        if (roll < 75) return 0.5;

        return 2;
        }

        if (roll < 25) return 2;

        if (roll < 50) return 0.5;

        return 0.1;
    };

    render() {
        const { rollType, roll, chance, payout } = this.state;
        const { result, disableControls, onResultAnimation } = this.props;

        return (
        <div styleName="root">
            <div styleName="container">
            <div styleName="slider">
                <div styleName="slider-container">
                <Slider
                    onChange={this.handleSlider}
                    roll={rollType}
                    value={roll}
                    result={result}
                    disableControls={disableControls}
                    onResultAnimation={onResultAnimation}
                />
                <ButtonIcon
                    onClick={this.handleRoll}
                    icon="rotate"
                    label="Reverse roll"
                    rollType={rollType}
                />
                </div>
            </div>
            <div styleName="values">
                <div styleName="values-container">
                <InputNumber
                    name="payout"
                    min={minPayout}
                    max={maxPayout}
                    precision={4}
                    step={this.getPayoutStep()}
                    title="Payout"
                    onChange={this.handlePayout}
                    icon="cross"
                    value={payout}
                />
                <InputNumber
                    name="roll"
                    icon="rotate"
                    title={`Roll ${startCase(rollType)}`}
                    precision={2}
                    disabled
                    step={0.5}
                    value={roll}
                />
                <InputNumber
                    name="chance"
                    precision={4}
                    min={2}
                    max={98}
                    unit="%"
                    title="Win Chance"
                    onChange={this.handleChance}
                    value={chance}
                    step="any"
                />
                </div>
            </div>
            </div>
        </div>
        );
    }
}
