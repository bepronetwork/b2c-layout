import React, { Component } from "react";
import PropTypes from "prop-types";
import RouletteBoard from "components/RouletteBoard";
import classNames from "classnames";
import { ButtonIcon } from "components";
import { isEmpty } from "lodash";
import Roulette from "components/Roulette";

import "./index.css";

const mobileBreakpoint = 768;

export default class RouletteGameCard extends Component {
  redColors = [1, 3, 5, 7, 9, 12, 14, 18, 16, 21, 23, 27, 25, 30, 32, 36, 34];

  static propTypes = {
    result: PropTypes.number,
    onAddChip: PropTypes.func.isRequired,
    betHistory: PropTypes.arrayOf(
      PropTypes.shape({ cell: PropTypes.string, chip: PropTypes.number })
    ).isRequired,
    onClear: PropTypes.func.isRequired,
    onUndo: PropTypes.func.isRequired,
    bet: PropTypes.bool,
    onResultAnimation: PropTypes.func.isRequired,
    isAddChipDisabled: PropTypes.bool.isRequired
  };

  static defaultProps = {
    result: null,
    bet: false
  };

  state = {
    rotating: null
  };

  handleAnimationEnd = () => {
    const { onResultAnimation, bet } = this.props;

    if (document.documentElement.clientWidth > mobileBreakpoint && bet) {
      onResultAnimation();
    }
  };

  renderResult = () => {
    const { result } = this.props;
    const { rotating } = this.state;

    const resultStyles = classNames("result", {
      green: result === 0 && !rotating,
      red: this.redColors.includes(result) && !rotating,
      picked:
        result && result !== 0 && !this.redColors.includes(result) && !rotating
    });

    return (
      <div styleName="result-container">
        <div styleName={resultStyles} onTransitionEnd={this.handleAnimationEnd}>
          <h4>{result}</h4>
        </div>
      </div>
    );
  };

  renderClearUndo = () => {
    const { onClear, onUndo, betHistory } = this.props;
    const { rotating } = this.state;

    const disabled = !betHistory || isEmpty(betHistory) || rotating;

    return (
      <div styleName="chip-controls">
        <ButtonIcon
          icon="undo"
          label="Undo"
          iconAtLeft
          onClick={onUndo}
          disabled={disabled}
        />

        <ButtonIcon
          icon="rotate"
          label="Clear"
          onClick={onClear}
          disabled={disabled}
        />
      </div>
    );
  };

  handleRouletteAnimation = value => {
    const { rotating } = this.state;
    const { onResultAnimation, bet } = this.props;

    if (rotating !== value) {
      this.setState({ rotating: value }, () => {
        if (
          document.documentElement.clientWidth <= mobileBreakpoint &&
          bet &&
          !value
        ) {
          onResultAnimation();
        }
      });
    }
  };

  render() {
    const {
      result,
      onAddChip,
      betHistory,
      bet,
      isAddChipDisabled
    } = this.props;
    const { rotating } = this.state;

    const rootStyles = classNames("root", {
      animation: rotating
    });

    const blockStyles = classNames("board-top", {
      block: bet
    });

    return (
      <div styleName={rootStyles}>
        {this.renderResult()}
        <div styleName="wheel">
          <Roulette
            bet={bet}
            result={result}
            onAnimation={this.handleRouletteAnimation}
          />
        </div>
        <div styleName="board">
          <div styleName={blockStyles} />
          <RouletteBoard
            onAddChip={onAddChip}
            result={result}
            betHistory={betHistory}
            rotating={rotating}
            isAddChipDisabled={isAddChipDisabled}
          />
        </div>
        {this.renderClearUndo()}
      </div>
    );
  }
}
