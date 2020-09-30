import React, { Component } from "react";
import { BaccaratGame, BaccaratGameOptions } from "components";
import images from "components/BaccaratGame/BaccaratMock";
import UserContext from "containers/App/UserContext";
import GamePage from "containers/GamePage";
import _, { find, reduce } from "lodash";
import { connect } from "react-redux";

import Cache from "../../lib/cache/cache";
import { setWonPopupMessageDispatcher } from "../../lib/redux";

class DicePage extends Component {
  static contextType = UserContext;

  state = {
    result: null,
    disableControls: false,
    rollNumber: 50,
    rollType: "under",
    bet: {},
    game_name: "Baccarat",
    animating: false,
    selectedChip: 0.1,
    game: {
      edge: 0
    },
    amount: 0,
    playeramount: 0,
    tieamount: 0,
    bankeramount: 0,
    onClickPlayerCoinValue: 0,
    onClickTieCoinValue: 0,
    onClickBankerCoinValue: 0,
    coinval: 1,
    activesliderchips: 1,
    totalBetAmount: 0,
    playerCoinChildren: 0,
    tieCoinChildren: 0,
    bankerCoinChildren: 0,
    betmultiply: 2,
    winammount: 2,
    CardAResultBack: [],
    CardBResultBack: [],
    CardBResultNumber: false,
    CardAResultNumber: false,
    resultSumA: [],
    resultSumB: [],
    resultSum: [],
    CardAResult: [],
    CardBResult: [],
    ResultText: "",
    sideAborderColor: "transparent",
    sideBborderColor: "transparent",
    notifyStatus: false,
    notifyStatusColor: "#00e403",
    sideACard1transform: "translate(858%, -127%) rotateY(180deg)",
    sideACard2transform: "translate(858%, -127%) rotateY(180deg)",
    sideACard3transform: "translate(858%, -127%) rotateY(180deg)",
    sideBCard1transform: "translate(290%, -127%) rotateY(180deg)",
    sideBCard2transform: "translate(290%, -127%) rotateY(180deg)",
    sideBCard3transform: "translate(290%, -127%) rotateY(180deg)",
    cardHide: false,
    gameRunning: false,
    playerCoinArr: [],
    tieCoinArr: [],
    bankerCoinArr: [],
    randNumber1: 0,
    randNumber2: 0,
    randNumber3: 0,
    resultCard: false
  };

  componentDidMount() {
    this.getGame();
  }

  getGame = () => {
    const appInfo = Cache.getFromCache("appInfo");

    if (appInfo) {
      const game = find(appInfo.games, { name: this.state.game_name });

      this.setState({ ...this.state, game });
    }
  };

  generateRandomArray = async () => {
    const result1 = Array.from({ length: 3 }, () =>
      Math.floor(Math.random() * 12)
    );
    const result2 = Array.from({ length: 3 }, () =>
      Math.floor(Math.random() * 12)
    );

    return this.setState({ CardAResult: result1, CardBResult: result2 });
  };

  functest = async () => {
    const { CardAResultBack } = this.state;

    if (CardAResultBack[0] === 9) {
      return this.setState({ CardAResult: [CardAResultBack[0]] });
    }

    if (CardAResultBack[0] + CardAResultBack[1] === 9) {
      return this.setState({
        CardAResult: [CardAResultBack[0], CardAResultBack[1]]
      });
    }

    if (CardAResultBack[0] + CardAResultBack[1] + CardAResultBack[2] === 9) {
      return this.setState({
        CardAResult: [
          CardAResultBack[0],
          CardAResultBack[1],
          CardAResultBack[2]
        ]
      });
    }
  };

  functest2 = async () => {
    const { CardBResultBack } = this.state;

    if (CardBResultBack[0] === 9) {
      return this.setState({ CardBResult: [CardBResultBack[0]] });
    }

    if (CardBResultBack[0] + CardBResultBack[1] === 9) {
      return this.setState({
        CardBResult: [CardBResultBack[0], CardBResultBack[1]]
      });
    }

    if (CardBResultBack[0] + CardBResultBack[1] + CardBResultBack[2] === 9) {
      return this.setState({
        CardBResult: [
          CardBResultBack[0],
          CardBResultBack[1],
          CardBResultBack[2]
        ]
      });
    }
  };

  funcToDefineNewArray = async () => {
    await this.functest();
    await this.functest2();
  };

  cardResult = async () => {
    const { CardAResult, CardBResultBack } = this.state;

    const sum = CardAResult.map((pv, cv) => {
      const result1 = images[pv].value;
      const result2 = images[cv].value;

      const sumTotal = result1 + result2;

      return console.log(result1 + result2);
    }, 0);

    return sum;
  };

  makeTheSum = async () => {
    const { resultSumA, resultSumB } = this.state;

    this.setState({ resultSum: [resultSumA, resultSumB] });

    const resultA = resultSumA[0] + resultSumA[1] + resultSumA[2];

  }

  resultCardFunc = async () => {
    await this.cardResult();
    await this.makeTheSum();
  }

  FuncToGetWinner = async () => {
    const { cardAResult, CardBResult } = this.state;

    // if (cardAResult.length === CardBResult.length) {
    //   this.setState({ ResultText: "TIE" });
    // } else if (cardAResult.length < CardBResult.length) {
    //   this.setState({ ResultText: "BANKER WINS" });
    // } else {
    //   this.setState({ ResultText: "PLAYER WINS" });
    // }
  };

  handleGenerateNumber = async () => {
    this.setState({
      randNumber1: Math.floor(Math.random() * 3 + 1),
      randNumber2: Math.floor(Math.random() * 3 + 1),
      randNumber3: Math.floor(Math.random() * 3 + 1)
    });
  };

  getTotalBet = () => {
    const { betHistory } = this.state;

    return reduce(
      betHistory,
      (sum, { chip }) => {
        return sum + chip;
      },
      0
    );
  };

  setCardsToInitialState = async () => {
    setTimeout(() => {
      this.setState({ cardHide: true, notifyStatus: false }, () => {
        setTimeout(() => {
          this.setState({
            sideAborderColor: "transparent",
            sideBborderColor: "transparent",
            notifyStatusColor: "#00e403",
            sideACard1transform: "translate(858%, -127%) rotateY(180deg)",
            sideACard2transform: "translate(858%, -127%) rotateY(180deg)",
            sideACard3transform: "translate(858%, -127%) rotateY(180deg)",
            sideBCard1transform: "translate(290%, -127%) rotateY(180deg)",
            sideBCard2transform: "translate(290%, -127%) rotateY(180deg)",
            sideBCard3transform: "translate(290%, -127%) rotateY(180deg)"
          });
        }, 300);
      });
    }, 50);
  };

  startGame = async () => {
    this.setState({
      cardHide: false,
      sideACard1transform: "translate(858%, -127%) rotateY(180deg)",
      sideACard2transform: "translate(858%, -127%) rotateY(180deg)",
      sideACard3transform: "translate(858%, -127%) rotateY(180deg)",
      sideBCard1transform: "translate(390%, -127%) rotateY(180deg)",
      sideBCard2transform: "translate(390%, -127%) rotateY(180deg)",
      sideBCard3transform: "translate(390%, -127%) rotateY(180deg)"
    });
    await this.showCards(500, 1, "A", "translate(0%, 0%) rotateY(180deg)");
    await this.showCards(300, 1, "B", "translate(0%, 0%) rotateY(180deg)");
    await this.showCards(300, 2, "A", "translate(0%, 0%) rotateY(180deg)");
    await this.showCards(300, 2, "B", "translate(0%, 0%) rotateY(180deg)");
    await this.showCards(300, 3, "A", "translate(0%, 0%) rotateY(180deg)");
    await this.showCards(300, 3, "B", "translate(0%, 0%) rotateY(180deg)");

    return new Promise(resolve => setTimeout(() => resolve(), 500));
  };

  showCards = async (time, val, data, rotateval) => {
    return new Promise(resolve => {
      setTimeout(async () => {
        const sideCard = `side${data}Card${val}`;
        const rotateState = `side${data}Card${val}transform`;

        this.setState(
          {
            [sideCard]: true,
            [rotateState]: rotateval
          },
          () => {
            setTimeout(() => {
              this.setState(
                { [rotateState]: "translate(0%, 0%) rotateY(0deg)" },
                () => {
                  resolve(true);
                }
              );
            }, 300);
          }
        );
      }, time);
    });
  };

  handlePlayerChildren = e => {
    if (e === "add") {
      if (this.state.playerCoinChildren < 5) {
        this.setState({
          playerCoinChildren: this.state.playerCoinChildren + 1,
          disableControls: true
        });
      }
    }

    if (e === "remove") {
      if (this.state.onClickPlayerCoinValue < 5) {
        this.setState({
          playerCoinChildren: this.state.onClickPlayerCoinValue,
          disableControls: true
        });
      }
    }
  };

  handleTieChildren = e => {
    if (e === "add") {
      if (this.state.tieCoinChildren < 5) {
        this.setState({
          tieCoinChildren: this.state.tieCoinChildren + 1,
          disableControls: true
        });
      }
    }

    if (e === "remove") {
      if (this.state.onClickTieCoinValue < 5) {
        this.setState({
          tieCoinChildren: this.state.onClickTieCoinValue,
          disableControls: false
        });
      }
    }
  };

  handleBankerChildren = e => {
    if (e === "add") {
      if (this.state.bankerCoinChildren < 5) {
        this.setState({
          bankerCoinChildren: this.state.bankerCoinChildren + 1,
          disableControls: false
        });
      }
    }

    if (e === "remove") {
      if (this.state.onClickBankerCoinValue < 5) {
        this.setState({
          bankerCoinChildren: this.state.onClickBankerCoinValue,
          disableControls: true
        });
      }
    }
  };

  handleCoin = e => {
    const {
      onClickPlayerCoinValue,
      onClickTieCoinValue,
      coinval,
      selectedChip
    } = this.state;

    if (e === "playerclicked") {
      this.handlePlayerChildren("add");
      const ev = onClickPlayerCoinValue + coinval;
      const playeramount = this.state.playeramount + selectedChip;
      const totalBetAmount = this.state.totalBetAmount + selectedChip;

      this.setState({
        onClickPlayerCoinValue: ev,
        playeramount,
        totalBetAmount,
        disableControls: true
      });
    }

    if (e === "tieclicked") {
      this.handleTieChildren("add");
      const ev = onClickTieCoinValue + this.state.coinval;
      const tieamount = this.state.tieamount + selectedChip;
      const totalBetAmount = this.state.totalBetAmount + selectedChip;

      this.setState({
        onClickTieCoinValue: ev,
        tieamount,
        totalBetAmount,
        disableControls: true
      });
    }

    if (e === "bankerclicked") {
      this.handleBankerChildren("add");
      const ev = this.state.onClickBankerCoinValue + this.state.coinval;
      const bankeramount = this.state.bankeramount + this.state.selectedChip;
      const totalBetAmount =
        this.state.totalBetAmount + this.state.selectedChip;

      this.setState({
        onClickBankerCoinValue: ev,
        bankeramount,
        totalBetAmount,
        disableControls: true
      });
    }
  };

  clearBaccaratState = async () => {
    this.setState({
      onClickPlayerCoinValue: 0,
      onClickTieCoinValue: 0,
      onClickBankerCoinValue: 0,
      selectedchipvalue: 1,
      coinval: 1,
      playerCoinChildren: 0,
      tieCoinChildren: 0,
      bankerCoinChildren: 0,
      activesliderchips: 1,
      totalBetAmount: 0,
      playeramount: 0,
      tieamount: 0,
      bankeramount: 0
    });
  };

  handleChangeChip = chip => {
    this.setState({ selectedChip: chip });
  };

  handleBetResult = async (bool, boolDisable) => {
    this.setState({ resultCard: bool, gameRunning: boolDisable });

    if (bool === true) {
      return this.setState({ CardBResultNumber: true });
    }

    return this.setState({ CardBResultNumber: false });
  };

  handleBet = async () => {
    await this.handleBetResult(false, true);
    await this.generateRandomArray();
    await this.handleGenerateNumber();
    await this.FuncToGetWinner();
    await this.funcToDefineNewArray();
    await this.startGame();
    await this.resultCardFunc();
    await this.handleBetResult(true, false);
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
    const { disableControls } = this.state;
    const { profile } = this.props;

    return (
      <BaccaratGameOptions
        handleBet={this.handleBet}
        onChangeChip={this.handleChangeChip}
        totalBet={this.getTotalBet()}
        game={this.state.game}
        profile={profile}
        doubleDownBet={this.doubleDownBet}
        disableControls={disableControls}
      />
    );
  };

  getGameCard = () => {
    const {
      onClickPlayerCoinValue,
      onClickTieCoinValue,
      onClickBankerCoinValue,
      gameRunning,
      notifyStatusColor,
      betmultiply,
      playerCoinChildren,
      tieCoinChildren,
      bankerCoinChildren,
      playeramount,
      tieamount,
      bankeramount,
      notifyStatus,
      winammount,
      ResultText,
      resultCard
    } = this.state;

    const playercoinchildren = [];
    const tiecoinchildren = [];
    const bankercoinchildren = [];

    return (
      <BaccaratGame
        onClickPlayerCoinValue={onClickPlayerCoinValue}
        onClickTieCoinValue={onClickTieCoinValue}
        onClickBankerCoinValue={onClickBankerCoinValue}
        gameRunning={gameRunning}
        notifyStatusColor={notifyStatusColor}
        clearBaccaratState={this.clearBaccaratState}
        betMultiply={betmultiply}
        playerCoinChildren={playerCoinChildren}
        tieCoinChildren={tieCoinChildren}
        bankerCoinChildren={bankerCoinChildren}
        playerCoinArr={playercoinchildren}
        tieCoinArr={tiecoinchildren}
        bankerCoinArr={bankercoinchildren}
        onClickPlayer={this.handleCoin.bind(this, "playerclicked")}
        onClickTie={this.handleCoin.bind(this, "tieclicked")}
        onClickBaker={this.handleCoin.bind(this, "bankerclicked")}
        playerAmount={playeramount}
        tieAmount={tieamount}
        bankerAmount={bankeramount}
        notifyStatus={notifyStatus}
        stateCard={{ ...this.state }}
        winAmount={winammount}
        handleBet={this.handleBet}
        getResultText={ResultText}
        resultCard={resultCard}
      />
    );
  };

  render() {
    const { onTableDetails } = this.props;

    return (
      <>
        <GamePage
          game={this.getGameCard()}
          options={this.getOptions()}
          gameMetaName="baccarat_simple"
          onTableDetails={onTableDetails}
        />
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
    ln: state.language
  };
}

export default connect(mapStateToProps)(DicePage);
