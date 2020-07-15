import React, { Component } from "react";
import { Tabs } from "components";
import { Matches, SerieFilter, GameFilter, BetSlip } from "components/Esports";
import { connect } from 'react-redux';
import { getGames, getMatches, getMatchesBySeries } from "controllers/Esports/EsportsUser";
import _ from 'lodash';
import "./index.css";

class AllMatches extends Component {

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
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        const { status, size } = this.state;
        const games = await getGames();
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

        newMatches.push(...matches);

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
        const { matches, games, size, isLoading, tab, gameFilter } = this.state;

        return (
            <div styleName="root">
                <div styleName="main">
                    <div styleName="game-filter">
                        <GameFilter 
                            games={games}
                            onCleanGameFilter={this.handleCleanGameFilterClick}
                            onGameFilter={this.handleGameFilterClick}
                            isLoading={isLoading}
                        />
                        <div>
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
                            />
                        </div>
                        <div styleName="right">
                            <BetSlip/>
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