import React, { Component } from "react";
import PropTypes from "prop-types";
import Sound from "react-sound";
import coinSound from "assets/coin-board-sound.mp3";
import TableCell from "./TableCell";
import { getAppCustomization } from "../../lib/helpers";
import { connect } from "react-redux";

import "./index.css";
import { CopyText } from "../../copy";

class RouletteBoard extends Component {
  static propTypes = {
    result: PropTypes.number,
    onAddChip: PropTypes.func.isRequired,
    betHistory: PropTypes.arrayOf(
      PropTypes.shape({ cell: PropTypes.string, chip: PropTypes.number })
    ).isRequired,
    rotating: PropTypes.bool,
    isAddChipDisabled: PropTypes.bool.isRequired
  };

  static defaultProps = {
    result: null,
    rotating: null
  };

  constructor(props) {
    super(props);

    this.state = {
      range0118Focused: false,
      evenFocused: false,
      redFocused: false,
      blackFocused: false,
      oddFocused: false,
      range1936Focused: false,
      range0112Focused: false,
      range1324Focused: false,
      range2536Focused: false,
      row1Focused: false,
      row2Focused: false,
      row3Focused: false,
      sound: false
    };
  }

  handleMouseEnter = event => {
    switch (event.currentTarget.id) {
      case "colorBlack":
        this.setState({ blackFocused: true });
        break;
      case "colorRed":
        this.setState({ redFocused: true });
        break;
      case "parityEven":
        this.setState({ evenFocused: true });
        break;
      case "parityOdd":
        this.setState({ oddFocused: true });
        break;
      case "range0118":
        this.setState({ range0118Focused: true });
        break;
      case "range1936":
        this.setState({ range1936Focused: true });
        break;
      case "range0112":
        this.setState({ range0112Focused: true });
        break;
      case "range1324":
        this.setState({ range1324Focused: true });
        break;
      case "range2536":
        this.setState({ range2536Focused: true });
        break;
      case "row1":
        this.setState({ row1Focused: true });
        break;
      case "row2":
        this.setState({ row2Focused: true });
        break;
      case "row3":
        this.setState({ row3Focused: true });
        break;
      default:
    }
  };

  handleMouseLeave = () => {
    this.setState({
      range0118Focused: false,
      evenFocused: false,
      redFocused: false,
      blackFocused: false,
      oddFocused: false,
      range1936Focused: false,
      range0112Focused: false,
      range1324Focused: false,
      range2536Focused: false,
      row1Focused: false,
      row2Focused: false,
      row3Focused: false
    });
  };

  handleClick = event => {
    const { onAddChip, isAddChipDisabled } = this.props;
    const { sound } = this.state;

    if (isAddChipDisabled) return null;

    if (sound) {
      onAddChip(event.currentTarget.id);

      return this.setState({ sound: false }, () => {
        this.setState({ sound: true });
      });
    }

    onAddChip(event.currentTarget.id);

    return this.setState({ sound: true });
  };

  renderSound = () => {
    const { sound } = this.state;
    const soundConfig = localStorage.getItem("sound");

    if (soundConfig !== "on" || !sound) {
      return null;
    }

    return (
      <Sound
        onFinishedPlaying={this.handleSongFinishedPlaying}
        volume={100}
        url={coinSound}
        playStatus="PLAYING"
        autoLoad
      />
    );
  };

  handleSongFinishedPlaying = () => {
    this.setState({ sound: false });
  };

  render() {
    const {
      range0118Focused,
      evenFocused,
      redFocused,
      blackFocused,
      oddFocused,
      range1936Focused,
      range0112Focused,
      range1324Focused,
      range2536Focused,
      row1Focused,
      row2Focused,
      row3Focused
    } = this.state;

    const { result, betHistory, rotating, ln } = this.props;
    const copy = CopyText.shared[ln];
    const darkColor = getAppCustomization().theme === "light" ? "pickled-bluewood-light" : "pickled-bluewood";

    return (
      <div styleName="root">
        {this.renderSound()}

        <button
          styleName="range1936"
          id="range1936"
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onClick={this.handleClick}
          type="button"
        >
          <TableCell label="19 to 36" id="range1936" betHistory={betHistory} />
        </button>
        <button
          styleName="parityOdd"
          id="parityOdd"
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onClick={this.handleClick}
          type="button"
        >
          <TableCell label={copy.ODD_NAME} id="parityOdd" betHistory={betHistory} />
        </button>
        <button
          styleName="colorBlack"
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          id="colorBlack"
          onClick={this.handleClick}
          type="button"
        >
          <TableCell
            color={darkColor}
            id="colorBlack"
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="colorRed"
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          id="colorRed"
          onClick={this.handleClick}
          type="button"
        >
          <TableCell color="red" id="colorRed" betHistory={betHistory} />
        </button>
        <button
          styleName="parityEven"
          id="parityEven"
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onClick={this.handleClick}
          type="button"
        >
          <TableCell label={copy.EVEN_NAME}  id="parityEven" betHistory={betHistory} />
        </button>
        <button
          styleName="range0118"
          id="range0118"
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onClick={this.handleClick}
          type="button"
        >
          <TableCell label="1 to 18" id="range0118" betHistory={betHistory} />
        </button>
        <button
          styleName="range2536"
          id="range2536"
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onClick={this.handleClick}
          type="button"
        >
          <TableCell label="25 to 36" id="range2536" betHistory={betHistory} />
        </button>
        <button
          styleName="range1324"
          id="range1324"
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onClick={this.handleClick}
          type="button"
        >
          <TableCell label="13 to 24" id="range1324" betHistory={betHistory} />
        </button>
        <button
          styleName="range0112"
          id="range0112"
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onClick={this.handleClick}
          type="button"
        >
          <TableCell label="1 to 12" id="range0112" betHistory={betHistory} />
        </button>
        <button
          styleName="row3"
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          id="row3"
          onClick={this.handleClick}
          type="button"
        >
          <TableCell label="2:1" id="row3" betHistory={betHistory} />
        </button>
        <button
          styleName="row2"
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          id="row2"
          onClick={this.handleClick}
          type="button"
        >
          <TableCell label="2:1" id="row2" betHistory={betHistory} />
        </button>
        <button
          styleName="row1"
          id="row1"
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onClick={this.handleClick}
          type="button"
        >
          <TableCell label="2:1" id="row1" betHistory={betHistory} />
        </button>
        <button
          styleName="number36"
          id="36"
          type="button"
          onClick={this.handleClick}
        >
          <TableCell
            label="36"
            color="red"
            focused={
              redFocused ||
              evenFocused ||
              range1936Focused ||
              range2536Focused ||
              row1Focused
            }
            isResult={rotating === false && result === 36}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number35"
          id="35"
          type="button"
          onClick={this.handleClick}
        >
          <TableCell
            label="35"
            focused={
              blackFocused ||
              oddFocused ||
              range1936Focused ||
              range2536Focused ||
              row2Focused
            }
            color={darkColor}
            isResult={rotating === false && result === 35}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number34"
          id="34"
          type="button"
          onClick={this.handleClick}
        >
          <TableCell
            label="34"
            color="red"
            focused={
              redFocused ||
              evenFocused ||
              range1936Focused ||
              range2536Focused ||
              row3Focused
            }
            isResult={rotating === false && result === 34}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number33"
          id="33"
          type="button"
          onClick={this.handleClick}
        >
          <TableCell
            label="33"
            color={darkColor}
            focused={
              blackFocused ||
              oddFocused ||
              range1936Focused ||
              range2536Focused ||
              row1Focused
            }
            isResult={rotating === false && result === 33}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number32"
          id="32"
          type="button"
          onClick={this.handleClick}
        >
          <TableCell
            label="32"
            color="red"
            focused={
              redFocused ||
              evenFocused ||
              range1936Focused ||
              range2536Focused ||
              row2Focused
            }
            isResult={rotating === false && result === 32}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number31"
          id="31"
          type="button"
          onClick={this.handleClick}
        >
          <TableCell
            label="31"
            color={darkColor}
            focused={
              blackFocused ||
              oddFocused ||
              range1936Focused ||
              range2536Focused ||
              row3Focused
            }
            isResult={rotating === false && result === 31}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number30"
          id="30"
          type="button"
          onClick={this.handleClick}
        >
          <TableCell
            label="30"
            color="red"
            focused={
              redFocused ||
              evenFocused ||
              range1936Focused ||
              range2536Focused ||
              row1Focused
            }
            isResult={rotating === false && result === 30}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number29"
          id="29"
          type="button"
          onClick={this.handleClick}
        >
          <TableCell
            label="29"
            color={darkColor}
            focused={
              blackFocused ||
              oddFocused ||
              range1936Focused ||
              range2536Focused ||
              row2Focused
            }
            isResult={rotating === false && result === 29}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number28"
          id="28"
          type="button"
          onClick={this.handleClick}
        >
          <TableCell
            label="28"
            color={darkColor}
            focused={
              blackFocused ||
              evenFocused ||
              range1936Focused ||
              range2536Focused ||
              row3Focused
            }
            isResult={rotating === false && result === 28}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number27"
          id="27"
          type="button"
          onClick={this.handleClick}
        >
          <TableCell
            label="27"
            color="red"
            focused={
              redFocused ||
              oddFocused ||
              range1936Focused ||
              range2536Focused ||
              row1Focused
            }
            isResult={rotating === false && result === 27}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number26"
          id="26"
          type="button"
          onClick={this.handleClick}
        >
          <TableCell
            label="26"
            color={darkColor}
            focused={
              blackFocused ||
              evenFocused ||
              range1936Focused ||
              range2536Focused ||
              row2Focused
            }
            isResult={rotating === false && result === 26}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number25"
          id="25"
          type="button"
          onClick={this.handleClick}
        >
          <TableCell
            label="25"
            color="red"
            focused={
              redFocused ||
              oddFocused ||
              range1936Focused ||
              range2536Focused ||
              row3Focused
            }
            isResult={rotating === false && result === 25}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number24"
          id="24"
          type="button"
          onClick={this.handleClick}
        >
          <TableCell
            label="24"
            color={darkColor}
            focused={
              blackFocused ||
              evenFocused ||
              range1936Focused ||
              range1324Focused ||
              row1Focused
            }
            isResult={rotating === false && result === 24}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number23"
          id="23"
          type="button"
          onClick={this.handleClick}
        >
          <TableCell
            label="23"
            color="red"
            focused={
              redFocused ||
              oddFocused ||
              range1936Focused ||
              range1324Focused ||
              row2Focused
            }
            isResult={rotating === false && result === 23}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number22"
          id="22"
          type="button"
          onClick={this.handleClick}
        >
          <TableCell
            label="22"
            color={darkColor}
            focused={
              blackFocused ||
              evenFocused ||
              range1936Focused ||
              range1324Focused ||
              row3Focused
            }
            isResult={rotating === false && result === 22}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number21"
          id="21"
          type="button"
          onClick={this.handleClick}
        >
          <TableCell
            label="21"
            color="red"
            focused={
              redFocused ||
              oddFocused ||
              range1936Focused ||
              range1324Focused ||
              row1Focused
            }
            isResult={rotating === false && result === 21}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number20"
          id="20"
          type="button"
          onClick={this.handleClick}
        >
          <TableCell
            label="20"
            color={darkColor}
            focused={
              blackFocused ||
              evenFocused ||
              range1936Focused ||
              range1324Focused ||
              row2Focused
            }
            isResult={rotating === false && result === 20}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number19"
          id="19"
          type="button"
          onClick={this.handleClick}
        >
          <TableCell
            label="19"
            color="red"
            focused={
              redFocused ||
              oddFocused ||
              range1936Focused ||
              range1324Focused ||
              row3Focused
            }
            isResult={rotating === false && result === 19}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number18"
          id="18"
          type="button"
          onClick={this.handleClick}
        >
          <TableCell
            label="18"
            color="red"
            focused={
              redFocused ||
              evenFocused ||
              range0118Focused ||
              range1324Focused ||
              row1Focused
            }
            isResult={rotating === false && result === 18}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number17"
          id="17"
          type="button"
          onClick={this.handleClick}
        >
          <TableCell
            label="17"
            color={darkColor}
            focused={
              blackFocused ||
              oddFocused ||
              range0118Focused ||
              range1324Focused ||
              row2Focused
            }
            isResult={rotating === false && result === 17}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number16"
          id="16"
          type="button"
          onClick={this.handleClick}
        >
          <TableCell
            label="16"
            color="red"
            focused={
              redFocused ||
              evenFocused ||
              range0118Focused ||
              range1324Focused ||
              row3Focused
            }
            isResult={rotating === false && result === 16}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number15"
          id="15"
          type="button"
          onClick={this.handleClick}
        >
          <TableCell
            label="15"
            color={darkColor}
            focused={
              blackFocused ||
              oddFocused ||
              range0118Focused ||
              range1324Focused ||
              row1Focused
            }
            isResult={rotating === false && result === 15}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number14"
          id="14"
          onClick={this.handleClick}
          type="button"
        >
          <TableCell
            label="14"
            color="red"
            focused={
              redFocused ||
              evenFocused ||
              range0118Focused ||
              range1324Focused ||
              row2Focused
            }
            isResult={rotating === false && result === 14}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number13"
          id="13"
          onClick={this.handleClick}
          type="button"
        >
          <TableCell
            label="13"
            color={darkColor}
            focused={
              blackFocused ||
              oddFocused ||
              range0118Focused ||
              range1324Focused ||
              row3Focused
            }
            isResult={rotating === false && result === 13}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number12"
          id="12"
          onClick={this.handleClick}
          type="button"
        >
          <TableCell
            label="12"
            color="red"
            focused={
              redFocused ||
              evenFocused ||
              range0118Focused ||
              range0112Focused ||
              row1Focused
            }
            isResult={rotating === false && result === 12}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number11"
          id="11"
          onClick={this.handleClick}
          type="button"
        >
          <TableCell
            label="11"
            color={darkColor}
            focused={
              blackFocused ||
              oddFocused ||
              range0118Focused ||
              range0112Focused ||
              row2Focused
            }
            isResult={rotating === false && result === 11}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number10"
          id="10"
          onClick={this.handleClick}
          type="button"
        >
          <TableCell
            label="10"
            color={darkColor}
            focused={
              blackFocused ||
              evenFocused ||
              range0118Focused ||
              range0112Focused ||
              row3Focused
            }
            isResult={rotating === false && result === 10}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number9"
          id="9"
          onClick={this.handleClick}
          type="button"
        >
          <TableCell
            label="9"
            color="red"
            focused={
              redFocused ||
              oddFocused ||
              range0118Focused ||
              range0112Focused ||
              row1Focused
            }
            isResult={rotating === false && result === 9}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number8"
          id="8"
          onClick={this.handleClick}
          type="button"
        >
          <TableCell
            label="8"
            color={darkColor}
            focused={
              blackFocused ||
              evenFocused ||
              range0118Focused ||
              range0112Focused ||
              row2Focused
            }
            isResult={rotating === false && result === 8}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number7"
          id="7"
          onClick={this.handleClick}
          type="button"
        >
          <TableCell
            label="7"
            color="red"
            focused={
              redFocused ||
              oddFocused ||
              range0118Focused ||
              range0112Focused ||
              row3Focused
            }
            isResult={rotating === false && result === 7}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number6"
          id="6"
          onClick={this.handleClick}
          type="button"
        >
          <TableCell
            label="6"
            color={darkColor}
            focused={
              blackFocused ||
              evenFocused ||
              range0118Focused ||
              range0112Focused ||
              row1Focused
            }
            isResult={rotating === false && result === 6}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number5"
          id="5"
          onClick={this.handleClick}
          type="button"
        >
          <TableCell
            label="5"
            color="red"
            focused={
              redFocused ||
              oddFocused ||
              range0118Focused ||
              range0112Focused ||
              row2Focused
            }
            isResult={rotating === false && result === 5}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number4"
          id="4"
          onClick={this.handleClick}
          type="button"
        >
          <TableCell
            label="4"
            color={darkColor}
            focused={
              blackFocused ||
              evenFocused ||
              range0118Focused ||
              range0112Focused ||
              row3Focused
            }
            isResult={rotating === false && result === 4}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number3"
          id="3"
          onClick={this.handleClick}
          type="button"
        >
          <TableCell
            label="3"
            color="red"
            focused={
              redFocused ||
              oddFocused ||
              range0118Focused ||
              range0112Focused ||
              row1Focused
            }
            isResult={rotating === false && result === 3}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number2"
          id="2"
          onClick={this.handleClick}
          type="button"
        >
          <TableCell
            label="2"
            color={darkColor}
            focused={
              blackFocused ||
              evenFocused ||
              range0118Focused ||
              range0112Focused ||
              row2Focused
            }
            isResult={rotating === false && result === 2}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number1"
          id="1"
          onClick={this.handleClick}
          type="button"
        >
          <TableCell
            label="1"
            color="red"
            focused={
              redFocused ||
              oddFocused ||
              range0118Focused ||
              range0112Focused ||
              row3Focused
            }
            isResult={rotating === false && result === 1}
            betHistory={betHistory}
          />
        </button>
        <button
          styleName="number0"
          id="0"
          onClick={this.handleClick}
          type="button"
        >
          <TableCell
            label="0"
            color="japanese-laurel"
            isResult={rotating === false && result === 0}
            betHistory={betHistory}
          />
        </button>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
      profile : state.profile,
      ln: state.language
  };
}

export default connect(mapStateToProps)(RouletteBoard);