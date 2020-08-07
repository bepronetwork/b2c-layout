import React, { Component } from "react";
import propTypes from "prop-types";
import { compose } from "lodash/fp";
import { connect } from "react-redux";
import { find } from "lodash";

import { SlotsGameOptions, SlotsGame } from "components";
import GamePage from "containers/GamePage";
import UserContext from "containers/App/UserContext";
import Cache from "../../lib/cache/cache";
import GameAudio from "../../components/GameAudio";

class SlotsPage extends Component {
  static contextType = UserContext;

  state = {
    result: null,
    bet: {},
    gameStore: [],
    line: false,
    betAmount: 0,
    matrixResult: [],
    testBol: Array(5).fill(false),
    testArray: [[11, 11, 11, 3, 12]],
    resultFirstColumn: [],
    resultSecondColumn: [],
    resultThirstColumn: [],
    resultFourthColumn: [],
    resultFiveColumn: [],
    insertionIndex: [],
    insertIndex: []
  };

  async componentDidMount() {
    this.getGame();
    await this.setNewRandomMatrix();
    this.getcolumn();
  }

  randomTable = (rows, cols) =>
    Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.floor(Math.random() * 10))
    );

  handleClick = async () => {
    this.setState({
      line: false,
      result: false,
      testBol: Array(5).fill(false),
      insertionIndex: [],
      insertIndex: []
    });

    this.getcolumn();
    await this.handleAnimations();

    await this.handleImage(1000);
    await this.handleResult();
  };

  handleResult = async () => {
    const { testBol } = this.state;

    testBol.map(async result => {
      if (result) {
        await this.setResult();
      }
    });
  };

  handleAnimations = async () => {
    this.handleAnimation("columnItem", 1);
    this.handleAnimation("columnItem2", 1.5);
    this.handleAnimation("columnItem3", 2);
    this.handleAnimation("columnItem4", 2.5);
    await this.handleAnimation("columnItem5", 3);

    await this.randomNumberResult();

    return new Promise(resolve => setTimeout(() => resolve(), 500));
  };

  handleAnimation = async (spinnerColumn, iterations) => {
    const box = document.getElementById(spinnerColumn);

    box.animate(
      [
        { transform: "translate3D(0, -30px, 0)" },
        { transform: "translate3D(0, 600px, 0)" }
      ],
      {
        duration: 500,
        iterations
      }
    );

    return new Promise(resolve => setTimeout(() => resolve(), 100));
  };

  setNewRandomMatrix = async () => {
    const resultRow = this.randomTable(40, 5);

    this.setState({ matrixResult: resultRow });
  };

  randomNumber = (min, max) => {
    const result = Math.floor(Math.random() * (max - min) + min);

    return result;
  };

  setResult = async () => {
    this.setState({ result: true });
  };

  getcolumn = async () => {
    const { matrixResult } = this.state;
    const arrayColumn = (arr, n) => {
      return arr.map(x => x[n]);
    };

    await this.setNewRandomMatrix();

    const resultFirstColumn = arrayColumn(matrixResult, 0);
    const resultSecondColumn = arrayColumn(matrixResult, 1);
    const resultThirstColumn = arrayColumn(matrixResult, 2);
    const resultFourthColumn = arrayColumn(matrixResult, 3);
    const resultFiveColumn = arrayColumn(matrixResult, 4);

    this.setState({
      resultFirstColumn,
      resultSecondColumn,
      resultThirstColumn,
      resultFourthColumn,
      resultFiveColumn
    });
  };

  randomNumberResult = async () => {
    const {
      testArray,
      resultFirstColumn,
      resultSecondColumn,
      resultThirstColumn,
      resultFourthColumn,
      resultFiveColumn
    } = this.state;

    const randNum = this.randomNumber(18, 20);
    const randNum2 = this.randomNumber(18, 20);
    const randNum3 = this.randomNumber(18, 20);
    const randNum4 = this.randomNumber(18, 20);
    const randNum5 = this.randomNumber(18, 20);

    const testArr = testArray[0];

    resultFirstColumn.splice(randNum, 1, testArr[0]);
    resultSecondColumn.splice(randNum2, 1, testArr[1]);
    resultThirstColumn.splice(randNum3, 1, testArr[2]);
    resultFourthColumn.splice(randNum4, 1, testArr[3]);
    resultFiveColumn.splice(randNum5, 1, testArr[4]);

    this.setState({
      insertionIndex: [randNum, randNum2, randNum3, randNum4, randNum5]
    });

    return new Promise(resolve => setTimeout(() => resolve(), 1500));
  };

  handleIconAudio = (number, Sound) => {
    const { testArray } = this.state;

    if (testArray[0] && testArray[1] === number) {
      return <GameAudio pathSound={Sound} />;
    }
  };

  handleAudioIcons = () => {
    this.handleIconAudio(1, null) ||
      this.handleIconAudio(2, null) ||
      this.handleIconAudio(3, null) ||
      this.handleIconAudio(4, null) ||
      this.handleIconAudio(5, null) ||
      this.handleIconAudio(7, null);
  };

  handleImage = async setTimeOut => {
    const { testArray, testBol, insertionIndex } = this.state;

    const testArr = testArray[0];

    let i = 0;

    while (i < 5) {
      if (testArr[0 + i] !== testArr[0 + (i + 1)]) {
        break;
      }

      testBol[0 + i] = true;
      testBol[0 + (i + 1)] = true;

      i += 1;
    }
    this.setState({ line: true });
    this.setState({ testBol });
    this.setState({
      insertIndex: insertionIndex
    });

    return new Promise(resolve => setTimeout(() => resolve(), setTimeOut));
  };

  getGame = () => {
    const appInfo = Cache.getFromCache("appInfo");

    if (appInfo) {
      const game = find(appInfo.games, { name: "Slots" });

      this.setState({ gameStore: game });
    }
  };

  handleBetAmountChange = betAmount => {
    this.setState({ betAmount });
  };

  renderGameCard = () => {
    const {
      testBol,
      line,
      testArray,
      result,
      resultFirstColumn,
      resultSecondColumn,
      resultThirstColumn,
      resultFourthColumn,
      resultFiveColumn,
      insertIndex
    } = this.state;

    return (
      <SlotsGame
        testBol={testBol}
        line={line}
        testArray={testArray}
        result={result}
        resultFirstColumn={resultFirstColumn}
        resultSecondColumn={resultSecondColumn}
        resultThirstColumn={resultThirstColumn}
        resultFourthColumn={resultFourthColumn}
        resultFiveColumn={resultFiveColumn}
        insertIndex={insertIndex}
      />
    );
  };

  renderGameOptions = () => {
    const { bet, totalBet, gameStore } = this.state;
    const { profile } = this.props;

    return (
      <SlotsGameOptions
        onClickBet={this.handleClick}
        onChangeChip={this.handleChangeChip}
        totalBet={totalBet}
        game={gameStore}
        profile={profile}
        doubleDownBet={this.doubleDownBet}
        disableControls={bet}
        onBetAmount={this.handleBetAmountChange}
      />
    );
  };

  render() {
    const { onTableDetails } = this.props;
    const { gameStore } = this.state;

    return (
      <GamePage
        options={this.renderGameOptions()}
        game={this.renderGameCard()}
        history="slotsHistory"
        slots="slots"
        gameMetaName={gameStore.metaName}
        onTableDetails={onTableDetails}
      />
    );
  }
}

SlotsPage.propTypes = {
  profile: propTypes.string.isRequired,
  onTableDetails: propTypes.string.isRequired
};

function mapStateToProps(state) {
  return {
    profile: state.profile,
    ln: state.language
  };
}

export default compose(connect(mapStateToProps))(SlotsPage);
