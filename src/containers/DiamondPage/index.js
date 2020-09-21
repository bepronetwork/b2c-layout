import React, { Component } from "react";
import { DiamondGamePage, DiamondGameOptions } from "components";
import PropTypes from "prop-types";
import UserContext from "containers/App/UserContext";
import GamePage from "containers/GamePage";
import diamondsBet from "lib/api/diamonds";
import _, { find } from "lodash";
import { connect } from "react-redux";
import Sound from "react-sound";

import DiamondSound from "assets/DiamondIcons/sound/diamond.mp3";
import DiamondResult from "assets/DiamondIcons/sound/result.mp3";
import images from "../../components/DiamondGame/images";
import Cache from "../../lib/cache/cache";
import { getAppCustomization } from "../../lib/helpers";

class DiamondPage extends Component {
  static contextType = UserContext;

  state = {
    result: null,
    resultBack: 0,
    disableControls: false,
    winAmount: 0,
    rollNumber: 50,
    rollType: "under",
    bet: {},
    gameName: "Diamonds",
    animating: false,
    amount: 0,
    game: {
      edge: 0
    },
    betAmount: 0,
    betObjectResult: {},
    resultTest: null,
    backendResult: [],
    isActiveBottomBar: false,
    isHover: false,
    isHover1: false,
    isHover2: false,
    isHover3: false,
    isHover4: false,
    isHover5: false,
    isHover6: false,
    isVisible1: false,
    isVisible2: false,
    isVisible3: false,
    isVisible4: false,
    isVisible5: false,
    sound: false,
    soundResult: false,
    resultSpace: [],
    isDisable: true,
    primaryColor: null,
    secondaryColor: null
  };

  componentDidMount() {
    this.getGame();
    this.setState({
      isHover6: true
    });
    this.getColors();
  }

  setSound = async value => {
    this.setState({ sound: value });
  };

  getColors = () => {
    const { colors } = getAppCustomization();

    const primaryColor = colors.find(color => {
      return color.type === "primaryColor";
    });

    const secondaryColor = colors.find(color => {
      return color.type === "secondaryColor";
    });

    this.setState({
      primaryColor: primaryColor.hex,
      secondaryColor: secondaryColor.hex
    });
  };

  handleAnimations = async idIcon => {
    const box = document.getElementById(idIcon);

    this.setSound(true);

    box.animate(
      [
        { transform: "translate3D(0, -20px, 0)" },
        { transform: "translate3D(0, 0px, 0)" }
      ],
      {
        duration: 100,
        iterations: 1
      }
    );

    if (idIcon === "svg-diamond-animated-1") {
      this.setState({
        isVisible1: true
      });
    }

    if (idIcon === "svg-diamond-animated-2") {
      this.setState({
        isVisible2: true
      });
    }

    if (idIcon === "svg-diamond-animated-3") {
      this.setState({
        isVisible3: true
      });
    }

    if (idIcon === "svg-diamond-animated-4") {
      this.setState({
        isVisible4: true
      });
    }

    if (idIcon === "svg-diamond-animated-5") {
      this.setState({
        isVisible5: true
      });
    }

    return new Promise(resolve => setTimeout(() => resolve(), 500));
  };

  checkArray = (item, value) => {
    const { resultBack } = this.state;

    const newItems = [...resultBack];

    newItems[item] = value;
    this.setState({ items: newItems });
  };

  setActiveHover = () => {
    const { resultBack } = this.state;

    switch (resultBack) {
      case 0:
        return this.setState({
          isHover6: true
        });
      case 1:
        return this.setState({
          isHover5: true,
          isHover6: false,
          soundResult: true
        });
      case 2:
        return this.setState({
          isHover4: true,
          isHover6: false,
          soundResult: true
        });
      case 3:
        return this.setState({
          isHover3: true,
          isHover6: false,
          soundResult: true
        });
      case 4:
        return this.setState({
          isHover2: true,
          isHover6: false,
          soundResult: true
        });
      case 5:
        return this.setState({
          isHover1: true,
          isHover6: false,
          soundResult: true
        });
      default:
        break;
    }
  };

  changeColorBottom = async (searchImage, number) => {
    const { backendResult } = this.state;

    const count = backendResult.filter(x => x === searchImage).length;

    if (count >= 2) {
      images[number].isActive = true;
    }

    if (count < 2) {
      images[number].isActive = false;
    }
  };

  SoundComponent = urlParam => {
    return (
      <Sound
        volume={100}
        useConsole={false}
        url={urlParam}
        playStatus="PLAYING"
        autoLoad
      />
    );
  };

  setTest = () => {
    this.changeColorBottom(0, 0);
    this.changeColorBottom(1, 1);
    this.changeColorBottom(2, 2);
    this.changeColorBottom(3, 3);
    this.changeColorBottom(4, 4);
    this.changeColorBottom(5, 5);
    this.changeColorBottom(6, 6);
  };

  randomNumber = (min, max) => {
    const result = Math.floor(Math.random() * (max - min) + min);

    return result;
  };

  setBottomBar = () => {
    this.setState({ isActiveBottomBar: true });
  };

  randBetween = (min, max) => Math.floor(Math.random() * (max - min)) + min;

  generateRandArray = async () => {
    const { resultBack } = this.state;

    const result1 = this.randBetween(0, 1);
    const result2 = this.randBetween(1, 2);
    const result3 = this.randBetween(3, 4);
    const result4 = this.randBetween(4, 5);
    const result5 = this.randBetween(5, 6);

    const resultest = this.randBetween(0, 2);
    const resultest1 = this.randBetween(2, 4);
    const resultest2 = this.randBetween(4, 6);

    const resultTest = this.randBetween(0, 3);
    const resultTest2 = this.randBetween(3, 6);

    const resultEqual = this.randBetween(0, 6);

    switch (resultBack) {
      case 0:
        return this.setState({
          backendResult: [
            this.randBetween(0, 1),
            this.randBetween(1, 2),
            this.randBetween(2, 3),
            this.randBetween(3, 4),
            this.randBetween(4, 6)
          ].sort(() => Math.random() - 0.5)
        });
      case 1:
        return this.setState({
          backendResult: [result1, result1, result3, result4, result5].sort(
            () => Math.random() - 0.5
          )
        });
      case 2:
        return this.setState({
          backendResult: [
            this.randBetween(4, 6),
            result1,
            result2,
            result1,
            result2
          ].sort(() => Math.random() - 0.5)
        });
      case 3:
        return this.setState({
          backendResult: [
            resultest,
            resultest,
            resultest1,
            resultest,
            resultest2
          ].sort(() => Math.random() - 0.5)
        });
      case 4:
        return this.setState({
          backendResult: [
            resultTest,
            resultTest2,
            resultTest,
            resultTest2,
            resultTest
          ].sort(() => Math.random() - 0.5)
        });
      case 5:
        return this.setState({
          backendResult: [
            result1,
            result1,
            result1,
            this.randBetween(3, 6),
            result1
          ].sort(() => Math.random() - 0.5)
        });
      case 6:
        return this.setState({
          backendResult: [
            resultEqual,
            resultEqual,
            resultEqual,
            resultEqual,
            resultEqual
          ].sort(() => Math.random() - 0.5)
        });
      default:
        break;
    }
  };

  generateRandomResult = async () => {
    const resultGen = Array.from({ length: 5 }, () =>
      Math.floor(Math.random() * 7)
    );

    this.setState({
      backendResult: resultGen
    });
  };

  setResultIcons = async () => {
    await this.handleAnimations("svg-diamond-animated-1");
    await this.handleAnimations("svg-diamond-animated-2");
    await this.handleAnimations("svg-diamond-animated-3");
    await this.handleAnimations("svg-diamond-animated-4");
    await this.handleAnimations("svg-diamond-animated-5");

    await this.setSound(false);
  };

  getGame = () => {
    const { gameName } = this.state;

    const appInfo = Cache.getFromCache("appInfo");

    if (appInfo) {
      const game = find(appInfo.games, { name: gameName });

      this.setState({ ...this.state, game, resultSpace: game.resultSpace });
    }
  };

  resetState = () => {
    this.setState({
      isActiveBottomBar: false,
      backendResult: [],
      isHover: false,
      isHover1: false,
      isHover2: false,
      isHover3: false,
      isHover4: false,
      isHover5: false,
      isHover6: true,
      isVisible1: false,
      isVisible2: false,
      isVisible3: false,
      isVisible4: false,
      isVisible5: false,
      sound: false,
      soundResult: false,
      winAmount: 0,
      resultWinAmount: 0,
      resultBack: 0
    });
  };

  setWinAmount = async () => {
    try {
      const { user } = this.context;
      const { onHandleLoginOrRegister } = this.props;
      const { winAmount } = this.state;

      if (!user) return onHandleLoginOrRegister("register");

      this.setState({ bet: true });

      this.setState({
        resultWinAmount: winAmount.toFixed(8)
      });
    } catch (err) {
      return this.setState({
        bet: false,
        hasWon: false,
        disableControls: false
      });
    }
  };

  userUpdateBalance = async () => {
    const { profile } = this.props;
    const { amount } = this.state;
    const { userDelta } = this.state.betObjectResult;

    await profile.updateBalance({ userDelta, amount });
  };

  handleBetAmountChange = ({ betAmount }) => {
    this.setState({ betAmount });
  };

  handleBet = async ({ amount }) => {
    try {
      const { user } = this.context;
      const { onHandleLoginOrRegister } = this.props;
      const { game } = this.state;

      this.resetState();

      if (!user || _.isEmpty(user)) return onHandleLoginOrRegister("register");

      window.soundManager.setup({ debugMode: false });
      this.setState({ disableControls: true });

      this.setState({ bet: true });

      const res = await diamondsBet({
        amount,
        user,
        game_id: game._id
      });

      this.setState({
        resultBack: res.result,
        bet: res,
        animating: true,
        betObjectResult: res,
        winAmount: res.winAmount,
        amount
      });

      await this.generateRandArray();

      await this.setResultIcons();

      this.setTest();
      this.setBottomBar();
      await this.setWinAmount();
      this.setActiveHover();
      await this.userUpdateBalance();

      this.setState({ disableControls: false });

      return res;
    } catch (err) {
      return this.setState({
        isActiveBottomBar: false,
        backendResult: [],
        isHover: false,
        isHover1: false,
        isHover2: false,
        isHover3: false,
        isHover4: false,
        isHover5: false,
        isHover6: true,
        isVisible1: false,
        isVisible2: false,
        isVisible3: false,
        isVisible4: false,
        isVisible5: false,
        sound: false,
        soundResult: false,
        winAmount: 0,
        resultWinAmount: 0,
        resultBack: 0
      });
    }
  };

  handleMouseEnter = () => {
    const { disableControls } = this.state;

    if (disableControls === false) {
      this.setState({
        isHover: true,
        isHover1: false,
        isHover2: false,
        isHover3: false,
        isHover4: false,
        isHover5: false,
        isHover6: false,
        soundResult: false
      });
    }
  };

  handleMouseEnter1 = () => {
    const { disableControls } = this.state;

    if (disableControls === false) {
      this.setState({
        isHover: false,
        isHover1: true,
        isHover2: false,
        isHover3: false,
        isHover4: false,
        isHover5: false,
        isHover6: false,
        soundResult: false
      });
    }
  };

  handleMouseEnter2 = () => {
    const { disableControls } = this.state;

    if (disableControls === false) {
      this.setState({
        isHover: false,
        isHover1: false,
        isHover2: true,
        isHover3: false,
        isHover4: false,
        isHover5: false,
        isHover6: false,
        soundResult: false
      });
    }
  };

  handleMouseEnter3 = () => {
    const { disableControls } = this.state;

    if (disableControls === false) {
      this.setState({
        isHover: false,
        isHover1: false,
        isHover2: false,
        isHover3: true,
        isHover4: false,
        isHover5: false,
        isHover6: false,
        soundResult: false
      });
    }
  };

  handleMouseEnter4 = () => {
    const { disableControls } = this.state;

    if (disableControls === false) {
      this.setState({
        isHover: false,
        isHover1: false,
        isHover2: false,
        isHover3: false,
        isHover4: true,
        isHover5: false,
        isHover6: false,
        soundResult: false
      });
    }
  };

  handleMouseEnter5 = () => {
    const { disableControls } = this.state;

    if (disableControls === false) {
      this.setState({
        isHover: false,
        isHover1: false,
        isHover2: false,
        isHover3: false,
        isHover4: false,
        isHover5: true,
        isHover6: false,
        soundResult: false
      });
    }
  };

  handleMouseEnter6 = () => {
    const { disableControls } = this.state;

    if (disableControls === false) {
      this.setState({
        isHover: false,
        isHover1: false,
        isHover2: false,
        isHover3: false,
        isHover4: false,
        isHover5: false,
        isHover6: true,
        soundResult: false
      });
    }
  };

  getOptions = () => {
    const { disableControls } = this.state;
    const { profile } = this.props;

    return (
      <DiamondGameOptions
        disableControls={disableControls}
        profile={profile}
        onBet={this.handleBet}
        game={this.state.game}
        onBetAmount={this.handleBetAmountChange}
      />
    );
  };

  getGameCard = () => {
    const {
      backendResult,
      isActiveBottomBar,
      isHover,
      isHover1,
      isHover2,
      isHover3,
      isHover4,
      isHover5,
      isHover6,
      isVisible1,
      isVisible2,
      isVisible3,
      isVisible4,
      isVisible5,
      sound,
      soundResult,
      resultWinAmount,
      resultSpace,
      primaryColor,
      secondaryColor
    } = this.state;

    return (
      <>
        {sound ? this.SoundComponent(DiamondSound) : null}
        {soundResult ? this.SoundComponent(DiamondResult) : null}
        <DiamondGamePage
          backendResult={backendResult}
          isActiveBottomBar={isActiveBottomBar}
          isHover={isHover}
          isHover1={isHover1}
          isHover2={isHover2}
          isHover3={isHover3}
          isHover4={isHover4}
          isHover5={isHover5}
          isHover6={isHover6}
          handleMouseEnter={this.handleMouseEnter}
          handleMouseEnter1={this.handleMouseEnter1}
          handleMouseEnter2={this.handleMouseEnter2}
          handleMouseEnter3={this.handleMouseEnter3}
          handleMouseEnter4={this.handleMouseEnter4}
          handleMouseEnter5={this.handleMouseEnter5}
          handleMouseEnter6={this.handleMouseEnter6}
          isVisible1={isVisible1}
          isVisible2={isVisible2}
          isVisible3={isVisible3}
          isVisible4={isVisible4}
          isVisible5={isVisible5}
          profitAmount={resultWinAmount}
          resultSpace={resultSpace}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />
      </>
    );
  };

  render() {
    const { onTableDetails } = this.props;

    return (
      <GamePage
        game={this.getGameCard()}
        options={this.getOptions()}
        history="diamondsHistory"
        gameMetaName={this.state.game.metaName}
        onTableDetails={onTableDetails}
      />
    );
  }
}

DiamondPage.propTypes = {
  profile: PropTypes.arrayOf.isRequired,
  onHandleLoginOrRegister: PropTypes.objectOf.isRequired,
  onTableDetails: PropTypes.objectOf.isRequired
};

function mapStateToProps(state) {
  return {
    profile: state.profile,
    ln: state.language
  };
}

export default connect(mapStateToProps)(DiamondPage);
