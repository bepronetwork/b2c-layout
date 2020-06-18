import React, { Component } from "react";
import propTypes from "prop-types";
import { compose } from "lodash/fp";
import { connect } from "react-redux";
import { find } from "lodash";

import { RouletteGameOptions } from "components";
import GamePage from "containers/GamePage";
import UserContext from "containers/App/UserContext";
import Cache from "../../lib/cache/cache";

const defaultState = {
  edge: 0,
  Result: null,
  hasWon: null,
  gameName: "Slots",
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

  getGame = () => {
    const { gameName, ...state } = this.state;
    const appInfo = Cache.getFromCache("appInfo");

    if (appInfo) {
      const game = find(appInfo.games, { name: gameName });

      this.setState({ ...state, game });
    }
  };

  renderGameOptions = () => {
    const { bet, game } = this.state;
    const { profile } = this.props;

    return (
      <RouletteGameOptions
        onBet={this.handleBet}
        onChangeChip={this.handleChangeChip}
        totalBet={this.getTotalBet()}
        game={game}
        profile={profile}
        doubleDownBet={this.doubleDownBet}
        disableControls={bet}
      />
    );
  };

  render() {
    const { onTableDetails } = this.props;
    const { game } = this.state;

    return (
      <GamePage
        options={this.renderGameOptions()}
        game={() => {}}
        history="rouletteHistory"
        gameMetaName={game.metaName}
        onTableDetails={onTableDetails}
      />
    );
  }
}

SlotsPage.propTypes = {
  profile: propTypes.string.isRequired,
  onTableDetails: propTypes.string.isRequired
};

function mapStateToProps(state) {
  return {
    profile: state.profile,
    ln: state.language
  };
}

export default compose(connect(mapStateToProps))(SlotsPage);
