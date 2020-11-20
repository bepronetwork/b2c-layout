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

import { renderSounds, randomNumber } from "../../lib/helpers/slotsHelpers";

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
      arrayObjects: [],
      animation: false,
      betObjectResult: {},
      resultMultiplier: 0,
      disableControls: true,
      amount: 0,
      game: {
        edge: 0
      },
      soundIcon: false,
      soundReel: false,
      timer: 0
    };
  }

  async componentDidMount() {
    this.getGame();
    await this.arrayOfObjects();
    this.countdownTimer();
  }

  arrayOfObjects = async () => {
    this.setState({
      arrayObjects: new Array(201).fill().map(() => {
        return {
          id: Array.from(Array(201).keys()),
          value: (Math.random() * (10 - 0) + 0).toFixed(2) * 1
        };
      })
    });
  };

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

  animationFalse = async () => {
    this.setState({
      animation: true
    });

    return new Promise(resolve => setTimeout(() => resolve(), 10000));
  };

  setResult = async () => {
    this.setState({ result: false });
  };

  countdownTimer = () => {
    const timerInterval = setInterval(() => {
      const seconds = 10;

      if (seconds === 0) {
        clearInterval(this.timerInterval);
      } else {
        this.setState(() => ({
          timer: seconds - 1,
          disabledFreeButton: true
        }));
      }
    }, 1000);

    return console.log(timerInterval);
  };

  handleAnimation = async () => {
    const box = document.getElementById("card");
  
    box.animate(
      [
        { transform: "translate3D(0, -30px, 0)" }
      ],
      {
        duration: 500,
        iterations: 1
      }
    );
  
    return new Promise(resolve => setTimeout(() => resolve(), 100));
  };

  handleBet = async ({ amount }) => {
    const { user } = this.context;
    const { onHandleLoginOrRegister } = this.props;
    this.handleAnimation();

    await this.arrayOfObjects();

    this.setState({
      line: false,
      result: false,
      soundIcon: false,
      animation: false
    });

    if (!user) return onHandleLoginOrRegister("register");

    await this.animationFalse();
    await this.setResult();
  };

  setSound = async () => {
    this.setState({ soundIcon: true });
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
    const { animation, result, arrayObjects, timer } = this.state;

    return (
      <>
        <SliderGame
          animation={animation}
          result={result}
          slideItems={arrayObjects}
          timer={timer}
        />
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
