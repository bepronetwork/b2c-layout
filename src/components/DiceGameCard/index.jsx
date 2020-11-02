import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  InputNumber,
  Slider,
  ButtonIcon,
  Typography,
  AnimationNumber,
} from "components";
import { startCase } from "lodash";
import { find } from "lodash";
import { connect } from "react-redux";
import { getAppCustomization } from "../../lib/helpers";
import { getPopularNumbers } from "../../lib/api/app";
import { Numbers } from "../../lib/ethereum/lib";
import { formatPercentage } from "../../utils/numberFormatation";
import { CopyText } from "../../copy";
import "./index.css";

let minPayout = 1.0102;
let maxPayout = 49.5;
let middlePayout = 2;
let middleRoll = 50;

const defaultState = {
  rollType: "under",
  chance: Number("49.5000"),
  payout: Number("2.0000"),
  edge: 0,
  popularNumbers: [],
};

class DiceGameCard extends Component {
  static propTypes = {
    result: PropTypes.number,
    disableControls: PropTypes.bool,
    onResultAnimation: PropTypes.func.isRequired,
    onChangeRollAndRollType: PropTypes.func.isRequired,
  };

  static defaultProps = {
    result: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      ...defaultState,
      result: props.result,
    };
  }

  componentDidMount() {
    this.projectData(this.props);
    this.getBets(this.props);
  }

  componentWillReceiveProps(props) {
    this.projectData(props);
  }

  async getBets(props) {
    const res_popularNumbers = await getPopularNumbers({ size: 15 });
    const gamePopularNumbers = find(res_popularNumbers, {
      game: props.game._id,
    });
    if (gamePopularNumbers) {
      this.setState({
        ...this.state,
        popularNumbers: gamePopularNumbers.numbers.sort(
          (a, b) => b.resultAmount - a.resultAmount
        ),
      });
    }
  }

  projectData(props) {
    let result = null;
    let nextProps = props;
    let prevState = this.state;
    const { rollNumber } = this.props;
    if (nextProps.result && nextProps.result !== prevState.result) {
      let history = localStorage.getItem("diceHistory");
      const win = !!(
        (nextProps.result >= rollNumber && prevState.rollType === "over") ||
        (nextProps.result < rollNumber && prevState.rollType === "under")
      );

      history = history ? JSON.parse(history) : [];
      history.unshift({ value: nextProps.result, win });
      localStorage.setItem("diceHistory", JSON.stringify(history));
      result = nextProps.result;
      this.setState({ ...this.state, result });
    } else {
      this.setState({
        edge: props.game.edge,
      });
    }
  }

  handlePayout = (payout) => {
    const { onChangeRollAndRollType } = this.props;
    const { rollType } = this.state;
    let newRoll;

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
      chance: rollType === "over" ? 100 - newRoll : newRoll,
    });

    onChangeRollAndRollType(newRoll, rollType);
  };

  handleChance = (value) => {
    const { onChangeRollAndRollType } = this.props;
    const { rollType } = this.state;
    const newRoll = rollType === "over" ? 100 - value : value;
    const payout = this.getPayout(newRoll);

    this.setState({
      chance: value,
      payout,
    });

    onChangeRollAndRollType(newRoll, rollType);
  };

  handleRoll = () => {
    const { onChangeRollAndRollType, rollNumber } = this.props;
    const { rollType } = this.state;
    const newRollType = rollType === "over" ? "under" : "over";
    const newRoll = 100 - rollNumber;

    this.setState({
      rollType: newRollType,
      chance: rollType === "over" ? newRoll : rollNumber,
    });

    onChangeRollAndRollType(newRoll, newRollType);
  };

  getPayout = (roll) => {
    const { rollType } = this.state;
    let payout;

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

  handleSlider = (value) => {
    const { onChangeRollAndRollType } = this.props;
    const { rollType } = this.state;
    const payout = this.getPayout(value);
    let chance = rollType === "over" ? 100 - value : value;
    this.setState({
      chance: chance,
      payout,
    });

    onChangeRollAndRollType(value, rollType);
  };

  getPayoutStep = () => {
    const { rollType } = this.state;
    const { rollNumber } = this.props;

    if (rollType === "over") {
      if (rollNumber < 50) return 0.1;
      if (rollNumber < 75) return 0.5;
      return 2;
    }

    if (rollNumber < 25) return 2;
    if (rollNumber < 50) return 0.5;
    return 0.1;
  };

  renderPopularNumbers = ({ popularNumbers }) => {
    if (!popularNumbers || (popularNumbers && popularNumbers.length < 1)) {
      return null;
    }

    const darkColor =
      getAppCustomization().theme === "light" ? "blue-square-light" : "";
    const totalAmount = popularNumbers.reduce((acc, item) => {
      return acc + item.resultAmount;
    }, 0);

    return (
      <div styleName="outer-popular-numbers">
        <div styleName="inner-popular-numbers">
          {popularNumbers.map((item) => {
            return (
              <div styleName="popular-number-row">
                <div
                  styleName={`popular-number-container blue-square ${darkColor}`}
                >
                  <Typography variant={"small-body"} color={"white"}>
                    {item.key}
                  </Typography>
                </div>
                <div styleName="popular-number-container-amount">
                  <AnimationNumber
                    number={formatPercentage(
                      Numbers.toFloat((item.resultAmount / totalAmount) * 100)
                    )}
                    variant={"small-body"}
                    color={"white"}
                    span={"%"}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  render() {
    let { rollType, chance, payout, popularNumbers } = this.state;
    const {
      result,
      disableControls,
      onResultAnimation,
      rollNumber,
      bet,
      animating,
    } = this.props;
    let winEdge = (100 - this.state.edge) / 100;
    payout = payout * winEdge;
    const { ln } = this.props;
    const copy = CopyText.diceGameCardIndex[ln];
    return (
      <div styleName="root">
        <div styleName="container">
          {this.renderPopularNumbers({ popularNumbers })}
          <div styleName="slider">
            <div styleName="slider-container">
              <Slider
                onChange={this.handleSlider}
                animating={animating}
                roll={rollType}
                bet={bet}
                value={rollNumber}
                result={result}
                disableControls={disableControls}
                onResultAnimation={onResultAnimation}
              />
              <ButtonIcon
                onClick={this.handleRoll}
                icon="rotate"
                label={copy.INDEX.BUTTON_ICON.LABEL[0]}
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
                title={copy.INDEX.INPUT_NUMBER.TITLE[0]}
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
                value={rollNumber}
              />
              <InputNumber
                name="chance"
                precision={4}
                min={2}
                max={98}
                unit="%"
                title={copy.INDEX.INPUT_NUMBER.TITLE[1]}
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

function mapStateToProps(state) {
  return {
    profile: state.profile,
    ln: state.language,
  };
}

export default connect(mapStateToProps)(DiceGameCard);
