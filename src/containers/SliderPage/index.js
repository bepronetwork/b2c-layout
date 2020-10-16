import React, { Component } from "react";
import propTypes from "prop-types";
import { compose } from "lodash/fp";
import { connect } from "react-redux";
import { find } from "lodash";

import { SliderGameOptions, SliderGame } from "components";
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

import {
  renderSounds,
  randomNumber
} from "../../lib/helpers/slotsHelpers";

import Cache from "../../lib/cache/cache";

class SlotsPage extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      result: null,
      resultSound: false,
      gameName: "Slots",
      gameStore: [],
      line: false,
      betObjectResult: {},
      resultMultiplier: 0,
      disableControls: true,
      amount: 0,
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

  userUpdateBalance = async () => {
    const { profile } = this.props;
    const { amount } = this.state;
    const { userDelta } = this.state.betObjectResult;

    await profile.updateBalance({ userDelta, amount });
    return new Promise(resolve => setTimeout(() => resolve(), 500));
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

      await this.handleAnimations();

  };

  handleResult = async () => {
    const { testBol } = this.state;

    testBol.map(async result => {
      if (result) {
        await this.setResult();
      }
    });
  };

 handleAnimation = async (spinnerColumn, iterations) => {
    const box = document.getElementById(spinnerColumn);
  
    box.animate(
      [
        { transform: "translate3D(-30px, 0, )" },
        { transform: "translate3D(-1600px, 0, 0)" },
        { transition: "transform 10000ms cubic-bezier(0.24, 0.78, 0.15, 1) 0s" }
      ],
      {
        duration: 3000,
        iterations
      }
    );
  
    return new Promise(resolve => setTimeout(() => resolve(), 100));
  };

  handleAnimations = async () => {
    this.handleAnimation("container-slide", 1);

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
    const { gameName } = this.state;

    const appInfo = Cache.getFromCache("appInfo");

    if (appInfo) {
      const game = find(appInfo.games, { name: gameName });

      this.setState({ ...this.state, game });
    }
  };

  handleBetAmountChange = betAmount => {
    this.setState({ betAmount, soundIcon: false, resultSound: false });
  };

  renderGameCard = () => {
    const {
      soundIcon,
      soundReel,
      resultSound,
    } = this.state;

    return (
      <>
        <SliderGame />
      </>
    );
  };

  renderGameOptions = () => {
    const { disableControls } = this.state;
    const { profile } = this.props;

    return (
      <SliderGameOptions
        onBetAmount={this.handleBetAmountChange}
        onBet={this.handleBet}
        game={this.state.game}
        profile={profile}

      />
    );
  };

  render() {
    const { onTableDetails } = this.props;

    return (
      <GamePage
        options={this.renderGameOptions()}
        game={this.renderGameCard()}
        history="slotsHistory"
        slots="slots"
        gameMetaName={this.state.game.metaName}
        onTableDetails={onTableDetails}
      />
    );
  }
}

SlotsPage.propTypes = {
  profile: propTypes.objectOf.isRequired,
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
