import React, { Component } from "react";
import propTypes from "prop-types";
import { compose } from "lodash/fp";
import { connect } from "react-redux";
import Sound from "react-sound";
import { find } from "lodash";

import { SlotsGameOptions, SlotsGame } from "components";
import GamePage from "containers/GamePage";
import UserContext from "containers/App/UserContext";

import Coin from "assets/audio/slotsaudio/coin.mp3";
import BlueCoin from "assets/audio/slotsaudio/blue-coin.mp3";
import Club from "assets/audio/slotsaudio/club.mp3";
import Spade from "assets/audio/slotsaudio/spade.mp3";
import Heart from "assets/audio/slotsaudio/heart.mp3";
import Octagon from "assets/audio/slotsaudio/octagon.mp3";
import Dog from "assets/audio/slotsaudio/dog.mp3";
import Quadrilateral from "assets/audio/slotsaudio/quadrilateral.mp3";
import Diamond from "assets/audio/slotsaudio/diamond.mp3";
import Triangle from "assets/audio/slotsaudio/triangle.mp3";
import Pentagon from "assets/audio/slotsaudio/pentagon.mp3";
import Beetle from "assets/audio/slotsaudio/beetle.mp3";
import Esfinge from "assets/audio/slotsaudio/esfinge.mp3";

import Reel from "assets/audio/slotsaudio/reels.mp3";
import Result from "assets/audio/slotsaudio/result.mp3";
import {
  renderSounds,
  handleAnimation,
  randomNumber
} from "../../helpers/SlotsHelpers";

import Cache from "../../lib/cache/cache";

class SlotsPage extends Component {
  static contextType = UserContext;

  state = {
    result: null,
    bet: {},
    gameStore: [],
    line: false,
    // betAmount: 0,
    matrixResult: [],
    soundIcon: false,
    soundReel: false,
    testBol: Array(5).fill(false),
    testArray: [[10, 11, 7, 3, 12]],
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
      soundIcon: false,
      testBol: Array(5).fill(false),
      insertionIndex: [],
      insertIndex: []
    });
    this.setState({ soundReel: true });

    this.getcolumn();
    await this.handleAnimations();
    this.setState({ soundReel: false });

    this.setSound();
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
    handleAnimation("columnItem", 1);
    handleAnimation("columnItem2", 1.5);
    handleAnimation("columnItem3", 2);
    handleAnimation("columnItem4", 2.5);
    await handleAnimation("columnItem5", 3);

    await this.randomNumberResult();

    return new Promise(resolve => setTimeout(() => resolve(), 500));
  };

  setNewRandomMatrix = async () => {
    const resultRow = this.randomTable(40, 5);

    this.setState({ matrixResult: resultRow });
  };

  setResult = async () => {
    this.setState({ result: true });
  };

  setSound = () => {
    const { testArray } = this.state;

    const testArr = testArray[0];

    if (testArr[0] !== testArr[1]) {
      this.setState({ soundIcon: false });
    } else this.setState({ soundIcon: true });
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

    const randNum = randomNumber(18, 20);
    const randNum2 = randomNumber(18, 20);
    const randNum3 = randomNumber(18, 20);
    const randNum4 = randomNumber(18, 20);
    const randNum5 = randomNumber(18, 20);
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

  handleIconAudio = () => {
    const { testArray } = this.state;

    const testArr = testArray[0];

    const switchCondit = testArr[0] && testArr[1];

    switch (switchCondit) {
      case 0:
        return renderSounds(BlueCoin);
      case 1:
        return renderSounds(Coin);
      case 2:
        return renderSounds(Club);
      case 3:
        return renderSounds(Spade);
      case 4:
        return renderSounds(Heart);
      case 5:
        return renderSounds(Octagon);
      case 6:
        return renderSounds(Quadrilateral);
      case 7:
        return renderSounds(Dog);
      case 8:
        return renderSounds(Diamond);
      case 9:
        return renderSounds(Triangle);
      case 10:
        return renderSounds(Pentagon);
      case 11:
        return renderSounds(Beetle);
      case 12:
        return renderSounds(Esfinge);

      default:
        break;
    }
  };

  handleLine = () => {
    const { testArray } = this.state;

    const testArr = testArray[0];

    if (testArr[0] !== testArr[1]) {
      this.setState({ line: false });
    } else this.setState({ line: true });
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
    this.handleLine();
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

  // handleBetAmountChange = betAmount => {
  //   this.setState({ betAmount });
  // };

  renderGameCard = () => {
    const {
      testBol,
      line,
      testArray,
      result,
      soundIcon,
      soundReel,
      resultFirstColumn,
      resultSecondColumn,
      resultThirstColumn,
      resultFourthColumn,
      resultFiveColumn,
      insertIndex
    } = this.state;

    return (
      <>
        {soundReel ? renderSounds(Reel) : null}
        {soundIcon ? this.handleIconAudio() : null}
        {result ? renderSounds(Result) : null}
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
      </>
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
