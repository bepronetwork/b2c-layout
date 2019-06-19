import React, { Component } from "react";
import { find } from "lodash";
import { GameCard } from "components";
import PropTypes from "prop-types";
import Dices from "components/Icons/Dices";
import roulette from "assets/roulette-wheel.png";
import Bitcoin from "components/Icons/Bitcoin";
import UserContext from "containers/App/UserContext";
import PlayInvitation from "components/PlayInvitation";

import "./index.css";

export default class HomePage extends Component {
  static contextType = UserContext;

  static propTypes = {
    onHandleLoginOrRegister: PropTypes.func.isRequired
  };

  renderPlayNow = () => {
    const { user } = this.context;
    const { onHandleLoginOrRegister } = this.props;

    if (user) {
      return null;
    }

    return <PlayInvitation onLoginRegister={onHandleLoginOrRegister} />;
  };

  isGameAvailable = game => {
    const appInfo = JSON.parse(localStorage.getItem("appInfo"));

    if (!appInfo) return null;

    return find(appInfo.games, { name: game });
  };

  render() {
    return (
      <div styleName="root">
        {this.renderPlayNow()}
        <div styleName="container">
          {this.isGameAvailable("Linear Dice") ? (
            <GameCard
              path="/dice"
              title="Dice"
              width="145px"
              color="cornflower-blue"
            >
              <Dices />
            </GameCard>
          ) : null}

          {this.isGameAvailable("Roulette") ? (
            <GameCard path="/roulette" title="Roulette" color="malachite">
              <img alt="roulette" src={roulette} />
            </GameCard>
          ) : null}
          {this.isGameAvailable("CoinFlip") ? (
            <GameCard
              path="/flip"
              title="Coin flip"
              width="110px"
              color="dodger-blue"
            >
              <div styleName="coin">
                <Bitcoin />
              </div>
            </GameCard>
          ) : null}
        </div>
      </div>
    );
  }
}
