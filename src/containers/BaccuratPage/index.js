import React, { Component } from "react";
import { BaccuratGame, RouletteGameOptions } from "components";
import PropTypes from "prop-types";
import UserContext from "containers/App/UserContext";
import GamePage from "containers/GamePage";
import _, { find, reduce } from "lodash";
import { connect } from "react-redux";

import club3 from "assets/cards/3C.svg";
import club7 from "assets/cards/7C.svg";

import diamondK from "assets/cards/KD.svg";
import diamondQ from "assets/cards/QD.svg";

import spades1 from "assets/cards/AS.svg";
import spades5 from "assets/cards/5S.svg";

import Cache from "../../lib/cache/cache";
import { setWonPopupMessageDispatcher } from "../../lib/redux";

class DicePage extends Component {
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
    game_name: "Baccarat",
    animating: false,
    game: {
      edge: 0
    },
    amount: 0,
    totalaccountbal: 100000000000000000000,
    playeramount: 0,
    tieamount: 0,
    bankeramount: 0,
    onClickPlayerCoinValue: 0,
    onClickTieCoinValue: 0,
    onClickBankerCoinValue: 0,
    selectedchipvalue: 1,
    coinval: 1,
    activesliderchips: 1,
    totalBetAmount: 0,
    manual: {
      squeezechecked: false,
      manual_tab_bet_button: true
    },
    auto: {
      auto_tab_bet_button: true,
      auto_tab_bet_button_text: "Start Autobet",
      numberofbets: "0"
    },
    playerCoinChildren: 0,
    tieCoinChildren: 0,
    bankerCoinChildren: 0,
    betmultiply: 2,
    winammount: 2,
    sideA: {
      counter: "0",
      card1: spades1,
      card2: diamondQ,
      card3: club3
    },
    sideB: {
      counter: "0",
      card1: spades5,
      card2: diamondK,
      card3: club7
    },
    sideACard1: false,
    sideACard2: false,
    sideACard3: false,
    sideBCard1: false,
    sideBCard2: false,
    sideBCard3: false,
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
    autobetstatus: true,
    gameRunning: false,
    playerCoinArr: [],
    tieCoinArr: [],
    bankerCoinArr: []
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

  handleRollAndRollTypeChange = (
    rollNumber,
    rollType = this.state.rollType
  ) => {
    this.setState({ rollNumber, rollType });
  };

  handleBet = async (e, bt) => {
    if (bt === "startgame" && !this.state.autobetstatus) {
      this.setState(
        {
          autobetstatus: true
        },
        () => {
          this.handleBet("handleautobet");
        }
      );
    }

    if (bt === "startgame" && this.state.auto.numberofbets === 0) {
      const kt = { ...this.state.auto };

      kt.numberofbets = "0";
      this.setState(
        {
          auto: kt,
          autobetstatus: true
        },
        () => {
          this.handleBet("handleautobet");
        }
      );
    }

    this.setState({ gameRunning: true });

    if (e === "handleManualBet") {
      const newState = this.state.manual;

      newState.manual_tab_bet_button = true;
      this.setState({ manual: newState });

      if (this.state.notifyStatus) {
        await this.setCardsToInitialState();
        setTimeout(() => {
          this.handleBet("handleManualBet");
        }, 400);
      } else {
        await this.startGame();
        setTimeout(() => {
          newState.manual_tab_bet_button = false;
          this.setState({
            sideAborderColor: "#00e403",
            notifyStatus: true,
            manual: newState,
            gameRunning: false
          });
        }, 500);
      }
    }

    if (e === "handleautobet" && this.state.autobetstatus) {
      console.log("resets");
      const newState = this.state.auto;

      newState.auto_tab_bet_button = true;
      newState.auto_tab_bet_button_text = "Stop Autobet";
      this.setState({ auto: newState });

      if (this.state.notifyStatus) {
        if (this.state.auto.numberofbets !== 0) {
          await this.setCardsToInitialState();
        }

        if (this.state.auto.numberofbets === 0) {
          const autost = { ...this.state.auto };

          autost.auto_tab_bet_button_text = "Start Autobet";
          autost.auto_tab_bet_button = false;
          this.setState({ auto: autost, gameRunning: false });
        }

        setTimeout(() => {
          if (this.state.auto.numberofbets !== 0) {
            this.handleBet("handleautobet");
          } else {
            const autost = { ...this.state.auto };

            autost.numberofbets = "0";
            this.setState({ auto: autost, gameRunning: false });
          }
        }, 700);
      } else {
        if (this.state.auto.numberofbets === "0") {
          await this.startGame();
          setTimeout(() => {
            this.handleAutoBetButton();
          }, 500);
        }

        if (this.state.auto.numberofbets > 0) {
          const oldAuto = { ...this.state.auto };

          oldAuto.numberofbets = this.state.auto.numberofbets - 1;
          this.setState({
            auto: oldAuto
          });
          await this.startGame();
          setTimeout(() => {
            this.handleAutoBetButton();
          }, 500);
        }
      }
    }

    if (e === "handleautobet" && !this.state.autobetstatus) {
      this.setState({
        gameRunning: false
      });
    }

    if (e === "stopAutobet") {
      const oldstateAuto = { ...this.state.auto };

      oldstateAuto.auto_tab_bet_button_text = "Finishing Bet";
      this.setState({
        auto: oldstateAuto,
        autobetstatus: false
      });
    }
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

  handleAutobetInput = e => {
    const oldState = { ...this.state.auto };

    oldState.numberofbets = e.target.value;
    this.setState({
      auto: oldState
    });
  };

  setCardsToInitialState = () => {
    setTimeout(() => {
      this.setState({ cardHide: true, notifyStatus: false }, () => {
        setTimeout(() => {
          console.log("setCardsToInitialState2");
          this.setState({
            sideAborderColor: "transparent",
            sideBborderColor: "transparent",
            notifyStatusColor: "#00e403",
            sideACard1: false,
            sideACard2: false,
            sideACard3: false,
            sideBCard1: false,
            sideBCard2: false,
            sideBCard3: false,
            sideACard1transform: "translate(858%, -127%) rotateY(180deg)",
            sideACard2transform: "translate(858%, -127%) rotateY(180deg)",
            sideACard3transform: "translate(858%, -127%) rotateY(180deg)",
            sideBCard1transform: "translate(290%, -127%) rotateY(180deg)",
            sideBCard2transform: "translate(290%, -127%) rotateY(180deg)",
            sideBCard3transform: "translate(290%, -127%) rotateY(180deg)"
          });
          setTimeout(() => {
            console.log("reset");

            if (this.state.auto.auto_tab_bet_button_text === "Finishing Bet") {
              const oldst = { ...this.state.auto };

              oldst.auto_tab_bet_button_text = "Start Autobet";
              oldst.auto_tab_bet_button = false;
              this.setState({
                auto: oldst
              });
            }
          }, 200);
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
      sideBCard1transform: "translate(290%, -127%) rotateY(180deg)",
      sideBCard2transform: "translate(290%, -127%) rotateY(180deg)",
      sideBCard3transform: "translate(290%, -127%) rotateY(180deg)"
    });
    await this.showCards(500, 1, "A", "translate(0%, 0%) rotateY(180deg)");
    await this.showCards(300, 1, "B", "translate(0%, 0%) rotateY(180deg)");
    await this.showCards(300, 2, "A", "translate(0%, 0%) rotateY(180deg)");
    await this.showCards(300, 2, "B", "translate(0%, 0%) rotateY(180deg)");
    await this.showCards(300, 3, "A", "translate(0%, 0%) rotateY(180deg)");
    await this.showCards(300, 3, "B", "translate(0%, 0%) rotateY(180deg)");
  };

  handleAutoBetButton = e => {
    const newState = this.state.auto;

    newState.auto_tab_bet_button = false;
    this.setState(
      {
        sideAborderColor: "#00e403",
        notifyStatus: true,
        auto: newState
      },
      () => {
        if (!this.state.autobetstatus) {
          const oldstateAuto = { ...this.state.auto };

          oldstateAuto.auto_tab_bet_button_text = "Start Autobet";
          this.setState({
            auto: oldstateAuto
          });
        }

        setTimeout(() => {
          if (
            this.state.totalaccountbal > this.state.totalBetAmount &&
            this.state.autobetstatus
          ) {
            this.handleBet("handleautobet");
          }

          if (!this.state.autobetstatus) {
            const oldstateAuto = { ...this.state.auto };

            oldstateAuto.auto_tab_bet_button_text = "Start Autobet";
            this.setState({
              autobetstatus: true,
              gameRunning: false,
              auto: oldstateAuto
            });
            console.log("step2");
          }
        }, 500);
      }
    );
  };

  showCards = async (time, val, data, rotateval) => {
    return new Promise((resolve, reject) => {
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

  handleSqueezeChecked = e => {
    if (e === "manual") {
      const oldState = { ...this.state.manual };

      oldState.squeezechecked = !oldState.squeezechecked;
      this.setState({ manual: oldState });
    }
  };

  onChangeWin = e => {
    console.log("onChangeWin", e);
  };

  handlePlayerChildren = e => {
    if (e === "add") {
      if (this.state.playerCoinChildren < 5) {
        this.setState({
          playerCoinChildren: this.state.playerCoinChildren + 1
        });
      }
    }

    if (e === "remove") {
      if (this.state.onClickPlayerCoinValue < 5) {
        this.setState({
          playerCoinChildren: this.state.onClickPlayerCoinValue
        });
      }
    }
  };

  handleTieChildren = e => {
    if (e === "add") {
      if (this.state.tieCoinChildren < 5) {
        this.setState({
          tieCoinChildren: this.state.tieCoinChildren + 1,
          disableControls: false
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
    if (e === "playerclicked") {
      this.handlePlayerChildren("add");
      const ev = this.state.onClickPlayerCoinValue + this.state.coinval;
      const playeramount =
        this.state.playeramount + this.state.selectedchipvalue;
      const totalBetAmount =
        this.state.totalBetAmount + this.state.selectedchipvalue;

      this.setState({
        onClickPlayerCoinValue: ev,
        playeramount,
        totalBetAmount,
        disableControls: true
      });
    }

    if (e === "tieclicked") {
      this.handleTieChildren("add");
      const ev = this.state.onClickTieCoinValue + this.state.coinval;
      const tieamount = this.state.tieamount + this.state.selectedchipvalue;
      const totalBetAmount =
        this.state.totalBetAmount + this.state.selectedchipvalue;

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
      const bankeramount =
        this.state.bankeramount + this.state.selectedchipvalue;
      const totalBetAmount =
        this.state.totalBetAmount + this.state.selectedchipvalue;

      this.setState({
        onClickBankerCoinValue: ev,
        bankeramount,
        totalBetAmount,
        disableControls: true
      });
    }

    if (e === "half") {
      const playeramount = Math.floor(this.state.playeramount / 2);
      const tieamount = Math.floor(this.state.tieamount / 2);
      const bankeramount = Math.floor(this.state.bankeramount / 2);
      const onClickPlayerCoinValue = Math.floor(
        this.state.onClickPlayerCoinValue / 2
      );
      const onClickTieCoinValue = Math.floor(
        this.state.onClickTieCoinValue / 2
      );
      const onClickBankerCoinValue = Math.floor(
        this.state.onClickBankerCoinValue / 2
      );
      const totalBetAmount = playeramount + tieamount + bankeramount;

      this.setState({
        playeramount,
        tieamount,
        bankeramount,
        onClickPlayerCoinValue,
        onClickTieCoinValue,
        onClickBankerCoinValue,
        totalBetAmount,
        disableControls: true
      });

      if (onClickPlayerCoinValue === 0) {
        this.setState({ playerCoinChildren: 0 });
      }

      if (onClickTieCoinValue === 0) {
        this.setState({ tieCoinChildren: 0 });
      }

      if (onClickBankerCoinValue === 0) {
        this.setState({ bankerCoinChildren: 0 });
      }

      setTimeout(() => {
        this.handlePlayerChildren("remove");
        this.handleTieChildren("remove");
        this.handleBankerChildren("remove");
      }, 10);
    }

    if (e === "double") {
      const playeramount = Math.floor(this.state.playeramount * 2);
      const tieamount = Math.floor(this.state.tieamount * 2);
      const bankeramount = Math.floor(this.state.bankeramount * 2);
      const onClickPlayerCoinValue = Math.floor(
        this.state.onClickPlayerCoinValue * 2
      );
      const onClickTieCoinValue = Math.floor(
        this.state.onClickTieCoinValue * 2
      );
      const onClickBankerCoinValue = Math.floor(
        this.state.onClickBankerCoinValue * 2
      );
      const totalBetAmount = playeramount + tieamount + bankeramount;

      console.log(
        "totalBetAmount",
        totalBetAmount,
        "playeramount",
        playeramount,
        "tieamount",
        tieamount,
        "bankeramount",
        bankeramount
      );

      this.setState({
        playeramount,
        tieamount,
        bankeramount,
        onClickPlayerCoinValue,
        onClickTieCoinValue,
        onClickBankerCoinValue,
        totalBetAmount
      });
      setTimeout(() => {
        if (onClickPlayerCoinValue !== 0) {
          this.handlePlayerChildren("add");
        }

        if (onClickTieCoinValue !== 0) {
          this.handleTieChildren("add");
        }

        if (onClickBankerCoinValue !== 0) {
          this.handleBankerChildren("add");
        }
      }, 10);
    }

    this.handleBetButton();
  };

  handleBetButton = () => {
    setTimeout(() => {
      const manualoldstate = { ...this.state.manual };
      const autooldstate = { ...this.state.auto };

      if (this.state.totalBetAmount !== 0) {
        manualoldstate.manual_tab_bet_button = false;
        autooldstate.auto_tab_bet_button = false;
        this.setState({
          manual: manualoldstate,
          auto: autooldstate
        });
      } else {
        manualoldstate.manual_tab_bet_button = true;
        autooldstate.auto_tab_bet_button = true;
        this.setState({
          manual: manualoldstate,
          auto: autooldstate
        });
      }
    }, 10);
  };

  handleChipClick = e => {
    this.setState({
      activesliderchips: e
    });

    if (e === 1) {
      this.setState({
        selectedchipvalue: 1,
        coinval: 1
      });
    }

    if (e === 2) {
      this.setState({
        selectedchipvalue: 10,
        coinval: 10
      });
    }

    if (e === 3) {
      this.setState({
        selectedchipvalue: 100,
        coinval: 100
      });
    }

    if (e === 4) {
      this.setState({
        selectedchipvalue: 1000,
        coinval: 1000
      });
    }

    if (e === 5) {
      this.setState({
        selectedchipvalue: 10000,
        coinval: 10000
      });
    }

    if (e === 6) {
      this.setState({
        selectedchipvalue: 100000,
        coinval: 100000
      });
    }

    if (e === 7) {
      this.setState({
        selectedchipvalue: 1000000,
        coinval: 1000000
      });
    }

    if (e === 8) {
      this.setState({
        selectedchipvalue: 10000000,
        coinval: 10000000
      });
    }

    if (e === 9) {
      this.setState({
        selectedchipvalue: 100000000,
        coinval: 100000000
      });
    }

    if (e === 10) {
      this.setState({
        selectedchipvalue: 1000000000,
        coinval: 1000000000
      });
    }

    if (e === 11) {
      this.setState({
        selectedchipvalue: 10000000000,
        coinval: 10000000000
      });
    }

    if (e === 12) {
      this.setState({
        selectedchipvalue: 100000000000,
        coinval: 100000000000
      });
    }

    if (e === 13) {
      this.setState({
        selectedchipvalue: 1000000000000,
        coinval: 1000000000000
      });
    }

    console.log("testchipclick", e);
  };

  clearBaccaratState = () => {
    const manualoldstate = { ...this.state.manual };

    manualoldstate.manual_tab_bet_button = true;
    this.setState({
      manual: manualoldstate,
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
      bankeramount: 0,
      disableControls: false
    });
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
      <RouletteGameOptions
        onBet={this.handleBet}
        onChangeChip={() => {}}
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
      winammount
    } = this.state;

    const playercoinchildren = [];
    const tiecoinchildren = [];
    const bankercoinchildren = [];

    return (
      <BaccuratGame
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
