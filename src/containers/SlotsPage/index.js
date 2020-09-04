import React, { Component } from "react";
import propTypes from "prop-types";
import { compose } from "lodash/fp";
import { connect } from "react-redux";
import { find } from "lodash";

import { SlotsGameOptions, SlotsGame } from "components";
import GamePage from "containers/GamePage";
import UserContext from "containers/App/UserContext";

import slotsBet from "lib/api/slots";
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
} from "../../lib/helpers/SlotsHelpers";

import Cache from "../../lib/cache/cache";

class SlotsPage extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      result: null,
      resultSound: false,
      gameStore: [],
      line: false,
      betObjectResult: {},
      resultMultiplier: 0,
      disableControls: false,
      game: {
        edge: 0
      },
      matrixResult: [],
      soundIcon: false,
      soundReel: false,
      testBol: Array(5).fill(false),
      testArray: [],
      resultFirstColumn: [],
      resultSecondColumn: [],
      resultThirstColumn: [],
      resultFourthColumn: [],
      resultFiveColumn: [],
      insertionIndex: [],
      insertIndex: []
    };
  }

  async componentDidMount() {
    this.getGame();
    await this.setNewRandomMatrix();
    this.getcolumn();
  }

  randomTable = (rows, cols) =>
    Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.floor(Math.random() * 10))
    );

  handleBetSend = async amount => {
    try {
      const { user } = this.context;

      const res = await slotsBet({
        amount,
        user
      });

      this.setState({
        testArray: res.result,
        betObjectResult: res,
        winAmount: res.winAmount.toFixed(8),
        resultMultiplier: (res.winAmount / res.betAmount).toFixed(2)
      });

      return res;
    } catch (err) {
      return err;
    }
  };

  userUpdateBalance = async () => {
    const { profile } = this.props;
    const { amount } = this.state;
    const { userDelta } = this.state.betObjectResult;

    await profile.updateBalance({ userDelta, amount });
  };

  handleBet = async ({ amount }) => {
    const { user } = this.context;
    const { onHandleLoginOrRegister } = this.props;

    if (!user) return onHandleLoginOrRegister("register");

    this.setState({
      line: false,
      result: false,
      soundIcon: false,
      testBol: Array(5).fill(false),
      insertionIndex: [],
      insertIndex: [],
      resultSound: false
    });
    this.setState({ disableControls: true });
    await this.handleBetSend(amount);
    this.setState({ soundReel: true });

    this.getcolumn();
    await this.handleAnimations();
    this.setState({ soundReel: false });
    await this.setSound();
    await this.handleImage(1000);
    await this.handleResult();
    await this.userUpdateBalance();
    this.setState({ disableControls: false });
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
    this.setState({ result: true, resultSound: true });
  };

  setSound = async () => {
    this.setState({ soundIcon: true });
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
    const testArr = testArray;

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

    const testArr = testArray;

    const switchCondit = testArr[0];

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
    this.setState({ line: true });
  };

  handleImage = async setTimeOut => {
    const { isWon } = this.state.betObjectResult;
    const { insertionIndex } = this.state;

    if (isWon === true) {
      this.setState({ testBol: Array(5).fill(true) });
    }

    this.handleLine();
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
    this.setState({ betAmount, soundIcon: false, resultSound: false });
  };

  renderGameCard = () => {
    const {
      testBol,
      line,
      testArray,
      result,
      soundIcon,
      soundReel,
      resultSound,
      resultFirstColumn,
      resultSecondColumn,
      resultThirstColumn,
      resultFourthColumn,
      resultFiveColumn,
      insertIndex,
      winAmount,
      resultMultiplier
    } = this.state;

    return (
      <>
        {soundReel ? renderSounds(Reel) : null}
        {soundIcon ? this.handleIconAudio() : null}
        {resultSound ? renderSounds(Result) : null}
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
          winAmount={winAmount}
          multiplier={resultMultiplier}
        />
      </>
    );
  };

  renderGameOptions = () => {
    const { disableControls } = this.state;
    const { profile } = this.props;

    return (
      <SlotsGameOptions
        onBetAmount={this.handleBetAmountChange}
        onBet={this.handleBet}
        game={this.state.game}
        profile={profile}
        disableControls={disableControls}
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
  onTableDetails: propTypes.string.isRequired,
  onHandleLoginOrRegister: propTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    profile: state.profile,
    ln: state.language
  };
}

export default compose(connect(mapStateToProps))(SlotsPage);
