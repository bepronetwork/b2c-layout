import React, { Component } from "react";
import { DiamondGamePage, DiceGameOptions } from "components";
import PropTypes from "prop-types";
import UserContext from "containers/App/UserContext";
import GamePage from "containers/GamePage";
// import diceBet from "lib/api/dice";
import _, { find } from "lodash";
import { connect } from "react-redux";

import images from "../../components/DiamondGame/images";
import Cache from "../../lib/cache/cache";
import { setWonPopupMessageDispatcher } from "../../lib/redux";

class DiamondPage extends Component {
  static contextType = UserContext;

  static propTypes = {
    onHandleLoginOrRegister: PropTypes.func.isRequired
  };

  state = {
    result: null,
    disableControls: false,
    rollNumber: 50,
    rollType: "under",
    bet: {},
    game_name: "Diamonds",
    animating: false,
    game: {
      edge: 0
    },
    amount: 0,
    backendResult: [],
    resultEquals: [],
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
    isVisible5: false
  };

  componentDidMount() {
    this.getGame();
    this.setState({
      isHover6: true
    });
  }

  caseSwitch = condition => {
    switch (condition) {
      case 0:
        return this.setState({
          isHover6: true
        });
      case 2:
        return this.setState({
          isHover5: true,
          isHover6: false
        });
      case 3:
        return this.setState({
          isHover3: true,
          isHover6: false
        });
      case 4:
        return this.setState({
          isHover1: true,
          isHover6: false
        });
      case 5:
        return this.setState({
          isHover: true,
          isHover6: false
        });

      default:
        break;
    }
  };

  handleAnimations = async idIcon => {
    const box = document.getElementById(idIcon);

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

  setActiveHover = () => {
    const { backendResult } = this.state;

    const result = backendResult.filter((e, i, a) => a.indexOf(e) !== i);

    if (result.length === 3) {
      const count = backendResult.filter(x => x === result[0]).length;
      const count2 = backendResult.filter(x => x === result[1]).length;
      const count3 = backendResult.filter(x => x === result[2]).length;

      const resultSum = count + count2 + count3;

      switch (resultSum) {
        case 8:
          return this.setState({
            isHover2: true,
            isHover6: false
          });
        default:
          break;
      }
    }

    if (result.length === 2) {
      if (result[0] === result[1]) {
        const count = backendResult.filter(x => x === result[0]).length;

        this.caseSwitch(count);
      }

      if (result[0] !== result[1]) {
        const count = backendResult.filter(x => x === result[0]).length;
        const count2 = backendResult.filter(x => x === result[1]).length;

        const resultSum = count + count2;

        switch (resultSum) {
          case 0:
            return this.setState({
              isHover6: true
            });
          case 2:
            return this.setState({
              isHover5: true,
              isHover6: false
            });
          case 3:
            return this.setState({
              isHover3: true,
              isHover6: false
            });
          case 4:
            return this.setState({
              isHover4: true,
              isHover6: false
            });
          case 5:
            return this.setState({
              isHover2: true,
              isHover6: false
            });
          default:
            break;
        }
      }
    }

    const count = backendResult.filter(x => x === result[0]).length;

    this.caseSwitch(count);
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

  setTest = () => {
    this.changeColorBottom(0, 0);
    this.changeColorBottom(1, 1);
    this.changeColorBottom(2, 2);
    this.changeColorBottom(3, 3);
    this.changeColorBottom(4, 4);
    this.changeColorBottom(5, 5);
    this.changeColorBottom(6, 6);
  };

  setBottomBar = () => {
    this.setState({ isActiveBottomBar: true });
  };

  generateRandomResult = async () => {
    this.setState({ backendResult: false });
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
  };

  getGame = () => {
    const appInfo = Cache.getFromCache("appInfo");

    if (appInfo) {
      const game = find(appInfo.games, { name: this.state.game_name });

      this.setState({ ...this.state, game });
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
      isVisible5: false
    });
  };

  handleRollAndRollTypeChange = (
    rollNumber,
    rollType = this.state.rollType
  ) => {
    this.setState({ rollNumber, rollType });
  };

  // handleBet = async ({ amount }) => {
  //   try {
  //     const { user } = this.context;
  //     const { onHandleLoginOrRegister } = this.props;
  //     const { rollNumber, rollType } = this.state;

  //     this.setState({ disableControls: true });

  //     if (!user || _.isEmpty(user)) return onHandleLoginOrRegister("register");

  //     const res = await diceBet({
  //       rollNumber,
  //       rollType,
  //       betAmount: amount,
  //       user
  //     });

  //     this.setState({
  //       result: res.result,
  //       bet: res,
  //       animating: true,
  //       betObjectResult: res,
  //       amount
  //     });

  //     return res;
  //   } catch (err) {
  //     return this.setState({ result: 0, disableControls: false });
  //   }
  // };

  handleBet = async () => {
    try {
      const { user } = this.context;
      const { onHandleLoginOrRegister } = this.props;

      if (!user || _.isEmpty(user)) return onHandleLoginOrRegister("register");

      this.resetState();
      this.setState({ disableControls: true });

      await this.generateRandomResult();
      await this.setResultIcons();
      this.setTest();
      this.setBottomBar();
      this.setActiveHover();
      this.setState({ disableControls: false });
    } catch (err) {
      return this.setState({ result: 0, disableControls: false });
    }
  };

  getOptions = () => {
    const { disableControls, rollType, rollNumber } = this.state;
    const { profile } = this.props;

    return (
      <DiceGameOptions
        disableControls={disableControls}
        profile={profile}
        onBet={this.handleBet}
        game={this.state.game}
        onChangeRollAndRollType={this.handleRollAndRollTypeChange}
        rollType={rollType}
        rollNumber={rollNumber}
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
      isVisible5
    } = this.state;

    return (
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
        isVisible1={isVisible1}
        isVisible2={isVisible2}
        isVisible3={isVisible3}
        isVisible4={isVisible4}
        isVisible5={isVisible5}
      />
    );
  };

  render() {
    const { onTableDetails } = this.props;

    return (
      <GamePage
        game={this.getGameCard()}
        options={this.getOptions()}
        history="diceHistory"
        gameMetaName={this.state.game.metaName}
        onTableDetails={onTableDetails}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
    ln: state.language
  };
}

export default connect(mapStateToProps)(DiamondPage);
