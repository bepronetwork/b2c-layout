import React, { Component } from "react";
import GamePage from "containers/GamePage";
import UserContext from "containers/App/UserContext";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import queryString from 'query-string';
import _ from "lodash";

const defaultState = {
    gameId : null,
    token: null,
    partnerId: null,
    url: null,
    externalId: null,
    provider: null,
    name: null
}


class ThirdPartyGamePage extends Component {
    static contextType = UserContext;

    constructor(props){
        super(props);
        this.state = defaultState;
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        const { profile, onHandleLoginOrRegister, currency } = props;
        const { params } = props.match;

        if (!profile || _.isEmpty(profile)) {
            return onHandleLoginOrRegister("login");
        }

        const gameIdParam = String(params.providerGameId);

        if(gameIdParam != null) {
            const queryParams = queryString.parse(this.props.location.search);
            const token = await profile.getProviderToken({
                    game_id: gameIdParam,
                    ticker: currency.ticker});

            this.setState({ gameId: gameIdParam, token, url: queryParams.url, partnerId: queryParams.partner_id, externalId: queryParams.external_id, provider: queryParams.provider, name: queryParams.name });
        }
    }


    render() {
        const { gameId, token, partnerId, url, externalId, provider, name } = this.state;

        if(gameId == null || token == null) { return null };

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


function mapStateToProps(state){
    return {
        profile: state.profile,
        ln : state.language,
        currency : state.currency
    };
}

export default compose(connect(mapStateToProps))(ThirdPartyGamePage);

