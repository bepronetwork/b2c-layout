import React, { Component } from "react";
import queryString from "query-string";
import { find } from "lodash";
import {
  GameCard,
  Banners,
  JackpotPot,
  SubSections,
  ThirdPartyGames,
  Typography
} from "components";
import PropTypes from "prop-types";
import UserContext from "containers/App/UserContext";
import PlayInvitation from "components/PlayInvitation";
import { connect } from "react-redux";
import { LOCATION } from "components/SubSections/properties";
import games from "../../config/games";
import LastBets from "../LastBets/HomePage";
import { getAppCustomization } from "../../lib/helpers";
import "./index.css";
import ThirdPartyGameList from "../ThirdPartyGameList";

class HomePage extends Component {
  static propTypes = {
    onHandleLoginOrRegister: PropTypes.func.isRequired,
    onHandleResetPassword: PropTypes.func,
    onHandleConfirmEmail: PropTypes.func
  };

  componentDidMount = () => {
    const {
      onHandleResetPassword,
      onHandleConfirmEmail,
      match: { params },
      location
    } = this.props;

    let queryParams = queryString.parse(location.search);

    if (onHandleResetPassword) {
      return onHandleResetPassword({ params: queryParams, mode: "new" });
    }

    if (onHandleConfirmEmail) {
      queryParams = { ...queryParams, app: params.app };

      return onHandleConfirmEmail({ params: queryParams });
    }

    return null;
  };

  renderPlayNow = () => {
    const { onHandleLoginOrRegister } = this.props;

    return (
      <PlayInvitation
        {...this.props}
        onLoginRegister={onHandleLoginOrRegister}
      />
    );
  };

  isGameAvailable = metaName => {
    return find(games, { metaName });
  };

  static contextType = UserContext;

  renderGame = ({
    metaName,
    name,
    edge,
    image_url,
    tableLimit,
    background_url
  }) => {
    const { onTableDetails } = this.props;

    if (!this.isGameAvailable(metaName)) {
      return null;
    }

    return (
      <div styleName="col">
        <GameCard
          path={metaName}
          title={name}
          edge={edge}
          image_url={image_url}
          tableLimit={tableLimit}
          background_url={background_url}
          onTableDetails={onTableDetails}
        />
      </div>
    );
  };

  render() {
    const { onTableDetails, history, onHandleLoginOrRegister } = this.props;
    const mobileBreakpoint = 768;
    const appInfo = JSON.parse(localStorage.getItem("appInfo"));

    if (!appInfo) {
      return null;
    }

    const skin = getAppCustomization().skin.skin_type;

    return (
      <div styleName="root">
        <SubSections location={LOCATION.BEFORE_BANNER} />
        <Banners />
        <SubSections location={LOCATION.BEFORE_GAMES} />
        <div styleName="container">
          {skin === "digital" ? (
            <div styleName="title-betprotocol">
              <Typography variant="small-body" weight="semi-bold" color="white">
                BetProtocol Games
              </Typography>
            </div>
          ) : null}
          <div styleName="container-small">
            {appInfo.games.map(item => this.renderGame(item))}
          </div>
          <ThirdPartyGames
            history={history}
            onHandleLoginOrRegister={onHandleLoginOrRegister}
          />
          <JackpotPot />
          <SubSections location={LOCATION.BEFORE_DATA_LIST} />
          {document.documentElement.clientWidth <= mobileBreakpoint ? null : (
            <div styleName="last-bets">
              <LastBets onTableDetails={onTableDetails} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
    ln: state.language
  };
}

export default connect(mapStateToProps)(HomePage);
