import React, { Component } from "react";
import GamePage from "containers/GamePage";
import UserContext from "containers/App/UserContext";
import { connect } from "react-redux";
import { compose } from "lodash/fp";
import { convertAmountProviderBigger } from "../../lib/helpers";
import queryString from "query-string";
import _ from "lodash";

const defaultState = {
  gameId: null,
  token: null,
  partnerId: null,
  url: null,
  externalId: null,
  provider: null,
  name: null,
};

class ThirdPartyGamePage extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = defaultState;
  }

  componentDidMount() {
    this.projectData(this.props);
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (props.currency !== this.props.currency) {
      this.projectData(props);
    }
  }

  projectData = async (props) => {
    const { profile, onHandleLoginOrRegister, currency } = props;
    const { params } = props.match;

    if (!profile || _.isEmpty(profile)) {
      return onHandleLoginOrRegister("login");
    }

    const gameId = String(params.providerGameId);

    if (gameId !== null) {
      const queryParams = queryString.parse(this.props.location.search);
      const token = await profile.getProviderToken({
        game_id: gameId,
        ticker: currency.ticker,
      });

      const url = queryParams.url;
      const partnerId = queryParams.partner_id;
      const externalId = queryParams.external_id;
      const provider = queryParams.provider;
      const name = queryParams.name;
      const ticker = convertAmountProviderBigger(currency.ticker, 1);

      this.setState({
        gameId,
        token,
        url,
        partnerId,
        externalId,
        provider,
        name,
        ticker,
      });
    }
  };

  render() {
    const { ln } = this.props;
    const {
      gameId,
      token,
      partnerId,
      url,
      externalId,
      provider,
      name,
      ticker,
    } = this.state;

    if (gameId === null || token === null) {
      return null;
    }

    if (document.documentElement.clientWidth <= 768) {
      window.location.href = `${url}/game?token=${token}&partner_id=${partnerId}&player_id=${externalId}&game_id=${gameId}&language=${ln}&currency=${ticker.ticker}`;
      return null;
    }

    return (
      <GamePage
        isThirdParty={true}
        providerGameId={gameId}
        providerToken={token}
        providerUrl={url}
        providerPartnerId={partnerId}
        providerExternalId={externalId}
        providerName={provider}
        providerGameName={name}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
    ln: state.language,
    currency: state.currency,
  };
}

export default compose(connect(mapStateToProps))(ThirdPartyGamePage);
