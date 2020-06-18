import React, { Component } from "react";
import propTypes from "prop-types";
import GamePage from "containers/GamePage";
import UserContext from "containers/App/UserContext";
import { find } from "lodash";
import { connect } from "react-redux";
import { compose } from "lodash/fp";
import Cache from "../../lib/cache/cache";
import { setWonPopupMessageDispatcher } from "../../lib/redux";

const defaultState = {
  edge: 0,
  Result: null,
  hasWon: null,
  gameName: "CoinFlip",
  isCoinSpinning: false,
  game: {
    edge: 0
  }
};

class SlotsPage extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = defaultState;
  }

  componentDidMount() {
    this.getGame();
  }

  handleAnimationEnd = () => {
    this.setState({ isCoinSpinning: false }, () => {
      this.handleUpdateBalance();
    });
  };

  handleAnimationStart = () => {
    this.setState({ isCoinSpinning: true });
  };

  handleUpdateBalance = async () => {
    const { profile } = this.props;
    const { betObjectResult } = this.state;
    const { result, hasWon, winAmount, userDelta } = betObjectResult;

    setWonPopupMessageDispatcher(winAmount);
    await profile.updateBalance({ userDelta });
    this.addToHistory({ result: `${result} `, won: hasWon });
  };

  handleEnableControls = () => {
    this.setState({ disableControls: false, flipResult: null });
  };

  addToHistory = ({ result, won }) => {
    try {
      let history = Cache.getFromCache("flipHistory");

      history = history || [];
      history.unshift({ value: result, win: won });
      Cache.setToCache("flipHistory", history);
    } catch (error) {
      console.log(error);
    }
  };

  onBet = async form => {
    this.setState({ onBet: true, disableControls: true });
    const res = await this.handleBet(form);

    this.setState({ onBet: false });

    return res;
  };

  handleBet = async () => {
    try {
      const { user } = this.context;
      const { onHandleLoginOrRegister } = this.props;

      if (!user) return onHandleLoginOrRegister("register")

    } catch (err) {
      return this.setState({
        Result: 0,
        hasWon: false,
        disableControls: false
      });
    }
  };

  getGame = () => {
    const appInfo = Cache.getFromCache("appInfo");
    const { gameName } = this.state;

    if (appInfo) {
      const game = find(appInfo.games, { name: gameName });

      this.setState({ ...this.state, game });
    }
  };

  render() {
    const { game, onTableDetails } = this.props;

    return (
      <GamePage
        options={this.getOptions()}
        game={this.getGameCard()}
        history="flipHistory"
        gameMetaName={game.metaName}
        onTableDetails={onTableDetails}
      />
    );
  }
}

SlotsPage.propTypes = {
  onHandleLoginOrRegister: propTypes.func.isRequired,
  profile: propTypes.string.isRequired,
  game: propTypes.string.isRequired,
  onTableDetails: propTypes.string.isRequired
};

function mapStateToProps(state) {
  return {
    profile: state.profile,
    ln: state.language
  };
}

export default compose(connect(mapStateToProps))(SlotsPage);
