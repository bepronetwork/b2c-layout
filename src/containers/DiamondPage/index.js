import React, { Component } from "react";
import { DiamondGamePage, DiceGameOptions } from "components";
import PropTypes from "prop-types";
import UserContext from "containers/App/UserContext";
import GamePage from "containers/GamePage";
import diceBet from "lib/api/dice";
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
    game_name: "Linear Dice",
    animating: false,
    game: {
      edge: 0
    },
    amount: 0,
    backendResult: [],
    resultEquals: [],
    isActiveBottomBar: false
  };

  componentDidMount() {
    this.getGame();
  }

  setActive = number => {
    images[number].isActive = false;
  };

  changeColorBottom = async (searchImage, number) => {
    const { backendResult } = this.state;

    const count = backendResult.filter(x => x === searchImage).length;

    if (count >= 2) {
      images[number].isActive = true;
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

    this.setState({ backendResult: resultGen });
    console.log(resultGen);
  };

  getGame = () => {
    const appInfo = Cache.getFromCache("appInfo");

    if (appInfo) {
      const game = find(appInfo.games, { name: this.state.game_name });

      this.setState({ ...this.state, game });
    }
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

  handleBet = async ({ amount }) => {
    try {
      const { user } = this.context;
      const { onHandleLoginOrRegister } = this.props;
      const { rollNumber, rollType } = this.state;

      this.setState({ disableControls: false });

      if (!user || _.isEmpty(user)) return onHandleLoginOrRegister("register");

      this.setState({ isActiveBottomBar: false, backendResult: [] });
      await this.generateRandomResult();

      this.setTest();
      this.setBottomBar();
    } catch (err) {
      return this.setState({ result: 0, disableControls: false });
    }
  };

  handleAnimation = async () => {
    const { profile } = this.props;
    const { amount } = this.state;
    const { winAmount, userDelta } = this.state.betObjectResult;

    setWonPopupMessageDispatcher(winAmount);
    await profile.updateBalance({ userDelta, amount });
    this.setState({ result: null, animating: false, disableControls: false });
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
    const { backendResult, isActiveBottomBar } = this.state;

    return (
      <DiamondGamePage
        backendResult={backendResult}
        isActiveBottomBar={isActiveBottomBar}
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
