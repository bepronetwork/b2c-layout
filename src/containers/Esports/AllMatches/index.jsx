import React, { Component } from "react";
import { Tabs } from "components";
import { Matches, SerieFilter, GameFilter, BetSlip, BetSlipFloat } from "components/Esports";
import { connect } from 'react-redux';
import { getGames, getMatches, getMatchesBySeries, getMatch } from "controllers/Esports/EsportsUser";
import _ from 'lodash';
import "./index.css";

import socketConnection from '../WebSocket'
import store from "../../App/store";
import { setBetSlipResult } from "../../../redux/actions/betSlip";

class AllMatches extends Component {
    static contextType = socketConnection;

    constructor(props){
        super(props);
        this.state = {
            gameFilter: [],
            serieFilter: [],
            games: [],
            matches: [],
            status: ["pre_match", "live"],
            size: 10,
            isLoading: true,
            tab: "upcoming"
        };
    }

    componentDidMount(){
        this.projectData(this.props)
        this.createSocketConnection(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    createSocketConnection = () => {
        const { connection } = this.context;

        if (connection) {
            connection.on("matchUpdate", this.updateMatch);
        }
    }

    updateMatch = async (data) => {
        const { matches } = this.state;

        const match = matches.find(match => match.id === data.message);

        if (match) {
            const matchUpdated = await getMatch(data.message);

            if (matchUpdated && !_.isEmpty(matchUpdated.odds)) {
                const index = matches.indexOf(match)

                let newMatches = [...matches];
    
                newMatches[index] = matchUpdated;
    
                this.setState({ matches: newMatches });

                this.updateBetSlip(matchUpdated, data.message);
            }
        }
    }

    updateBetSlip = (match, id) => {
        const state = store.getState();
        const { betSlip } = state;

        const ids = betSlip && _.isArray(betSlip) ? betSlip.map(bet => bet.externalMatchId) : [];

        if (ids.includes(id)) {
            let newBetSlip = [...betSlip];

            const betSlipArr = newBetSlip.map(bet => {
                if (bet.externalMatchId === match.id && !_.isEmpty(match.odds)) {

                    const opponent = match.odds[bet.type].find(opponent => opponent.participant_id === bet.id);
                    const marketActive = match.market ? match.market.status === 'active' : false;

                    let status;

                    if (parseFloat(opponent.odd) === parseFloat(bet.odd)) {
                        status = 'stable'
                    } else if (parseFloat(opponent.odd) < parseFloat(bet.odd)) {
                        status = 'down'
                    } else {
                        status = 'up'
                    }

                    return {...bet, odd: opponent.odd, status: status, marketActive: marketActive }
                } else {
                    return bet
                }
            })

            store.dispatch(setBetSlipResult(betSlipArr))
        }
    }

    projectData = async (props) => {
        const { status, size } = this.state;

        const images = require.context('assets/esports', true);
        
        let games = await getGames();
        games = games.filter(g => g.series.length > 0).map(g => {
            g.image = images('./' + g.slug + '-ico.png');
            return g;
        });

        const matches = await getMatches({
            status, size
        });

        this.setState({
            games,
            matches,
            isLoading: false
        });
    }

    handleGameFilterClick = async (gameFilter) => {
        let { games, matches, status, size } = this.state;

        this.setState({ isLoading: true });

        if(gameFilter.length > 0) {
            const filtered = games.filter(g => gameFilter.includes(g.external_id));
            const series = filtered.flatMap(item => item.series);
            const serieFilter = series.map(s => {
                return s.id
            });
            matches = await getMatchesBySeries({
                serie_id: serieFilter, 
                status, 
                size
            });
        }
        else {
            matches = await getMatches({
                status, 
                size
            });
        }

        this.setState({ gameFilter, matches, isLoading: false });
    }

    handleCleanGameFilterClick = async (gameFilter) => {
        const { status, size } = this.state;

        this.setState({ isLoading: true });

        const matches = await getMatches({
            status, 
            size
        });

        this.setState({ gameFilter, matches, isLoading: false });
    }

    handleSerieFilterClick = async (serieFilter) => {
        const { status } = this.state;

        this.setState({ isLoading: true });

        const matches = serieFilter.length > 0 ? await getMatchesBySeries({serie_id: serieFilter, status}): await getMatches({status});

        this.setState({ serieFilter, matches, isLoading: false });
    }

    handleCleanSerieFilterClick = async (serieFilter) => {
        const { status, size } = this.state;

        this.setState({ isLoading: true });

        const matches = await getMatches({
            status, 
            size
        });

        this.setState({ serieFilter, matches, isLoading: false });
    }

    handleFetchMoreData = async () => {
        let { matches, status, size, tab } = this.state;

        const offset = matches.length;
        const newMatches = await getMatches({
            status, 
            size, 
            offset,
            ...tab == "results" && { begin_at : "all" }
        });

        newMatches.unshift(...matches);

        this.setState({ matches: newMatches });
    }

    handleTabChange = async (name) => {
        const { size } = this.state;
        const status = (name == "results") ? ["finished", "settled"] : ["pre_match", "live"];

        this.setState({ tab: name, status, isLoading: true });

        const matches = await getMatches({
            status, 
            size,
            ...name == "results" && { begin_at : "all" }
        });

        this.setState({ matches, isLoading: false });

    };

    render() {
        const { history, onHandleLoginOrRegister } = this.props;
        const { matches, games, size, isLoading, tab, gameFilter } = this.state;

        return (
            <div styleName="root">
                <BetSlipFloat onHandleLoginOrRegister={onHandleLoginOrRegister}/>
                <div styleName="main">
                    <div styleName="game-filter">
                        <GameFilter 
                            games={games}
                            onCleanGameFilter={this.handleCleanGameFilterClick}
                            onGameFilter={this.handleGameFilterClick}
                            isLoading={isLoading}
                        />
                        <div styleName="tabs">
                            <Tabs
                                selected={tab}
                                options={[
                                {
                                    value: "upcoming",
                                    label: "Upcoming"
                                },
                                {   
                                    value: "results", 
                                    label: "Results"
                                }
                                ]}
                                onSelect={this.handleTabChange}
                                style="full-background"
                            />
                        </div>
                    </div>
                </div>
                <div styleName="results">
                    <div styleName="filters">
                        <SerieFilter
                            games={games}
                            onCleanSerieFilter={this.handleCleanSerieFilterClick}
                            onSerieFilter={this.handleSerieFilterClick}
                            isLoading={isLoading}
                            gameFilter={gameFilter}
                        />
                    </div>
                    <div styleName="matches">
                        <div>
                            <Matches 
                                matches={matches}
                                games={games}
                                onFetchMoreData={this.handleFetchMoreData}
                                size={size}
                                showInfiniteScroll={true}
                                isLoading={isLoading}
                                history={history}
                            />
                        </div>
                        <div styleName="right">
                            <BetSlip onHandleLoginOrRegister={onHandleLoginOrRegister}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        profile : state.profile,
        ln: state.language
    };
}

export default connect(mapStateToProps)(AllMatches);