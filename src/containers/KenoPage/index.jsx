import React, { Component } from "react";
import { KenoGameCard, KenoGameOptions } from "components";
import { setWonPopupMessageDispatcher } from "../../lib/redux";
import PropTypes from "prop-types";
import UserContext from "containers/App/UserContext";
import GamePage from "containers/GamePage";
import kenoBet from "lib/api/keno";
import Cache from "../../lib/cache/cache";
import _, { find } from "lodash";
import { connect } from "react-redux";
import defaultCards from "./defaultCards";

class KenoPage extends Component {
  static contextType = UserContext;

  static propTypes = {
    onHandleLoginOrRegister: PropTypes.func.isRequired,
  };

  state = {
    result: null,
    disableControls: false,
    bet: {},
    game_name: "Keno",
    animating: false,
    game: {
      edge: 0,
    },
    betAmount: 0,
    cards: JSON.parse(JSON.stringify(defaultCards)),
  };

  componentDidMount() {
    this.getGame();
  }

  getGame = () => {
    const appInfo = Cache.getFromCache("appInfo");
    if (appInfo) {
      let game = find(appInfo.games, { name: this.state.game_name });
      this.setState({ game });
    }
  };

  handleBetAmountChange = (betAmount) => {
    this.setState({ betAmount });
  };

  handleChooseCards = (cards) => {
    this.setState({ cards, isWon: false, result: null });
  };

  handleBet = async ({ amount }) => {
    try {
      const { cards } = this.state;
      const { user } = this.context;
      const { onHandleLoginOrRegister } = this.props;
      this.setState({ disableControls: true, isWon: false, result: null });
      if (!user || _.isEmpty(user)) return onHandleLoginOrRegister("register");

      const pickedCards = cards.filter(function(card) {
        return card.isPicked === true;
      });

      const res = await kenoBet({
        cards: pickedCards,
        betAmount: amount,
        user,
      });

      this.changeCardsFromResult(res.result);

      this.setState({
        result: res.result,
        isWon: res.isWon,
        bet: res,
        animating: true,
        betObjectResult: res,
        disableControls: false,
        winAmount: res.winAmount,
      });
      return res;
    } catch (err) {
      return this.setState({ result: [], disableControls: false });
    }
  };

  changeCardsFromResult(result) {
    const { cards } = this.state;

    cards.map((card) => {
      card.isSelected = result.includes(card.id) ? true : false;
    });

    this.setState({
      cards,
    });
  }

  handleAnimation = async () => {
    const { profile } = this.props;
    const { betAmount } = this.state;
    const { winAmount, userDelta, totalBetAmount } = this.state.betObjectResult;
    setWonPopupMessageDispatcher(winAmount);
    await profile.updateBalance({
      userDelta,
      amount: betAmount,
      totalBetAmount,
    });
    this.setState({ result: null, animating: false, disableControls: false });
  };

  getOptions = () => {
    const { disableControls, cards, animating } = this.state;
    const { profile } = this.props;
    const pickedCards = cards.filter(function(card) {
      return card.isPicked === true;
    });

    return (
      <KenoGameOptions
        disableControls={
          disableControls || pickedCards.length === 0 || animating === true
        }
        profile={profile}
        onBet={this.handleBet}
        game={this.state.game}
        onBetAmount={this.handleBetAmountChange}
      />
    );
  };

  getGameCard = () => {
    const {
      result,
      disableControls,
      bet,
      animating,
      betAmount,
      isWon,
      winAmount,
      cards,
    } = this.state;
    const { profile } = this.props;

    return (
      <KenoGameCard
        profile={profile}
        onResultAnimation={this.handleAnimation}
        disableControls={disableControls}
        result={result}
        animating={animating}
        bet={bet}
        game={this.state.game}
        betAmount={betAmount}
        onChooseCards={this.handleChooseCards}
        isWon={isWon}
        winAmount={winAmount}
        cards={cards}
      />
    );
  };

  render() {
    const { onTableDetails } = this.props;
    return (
      <GamePage
        game={this.getGameCard()}
        options={this.getOptions()}
        history="kenoHistory"
        gameMetaName={this.state.game.metaName}
        onTableDetails={onTableDetails}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
  };
}

export default connect(mapStateToProps)(KenoPage);
