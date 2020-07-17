import React, { Component } from "react";
import { Typography, Button, DimensionCarousel } from 'components';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { Opponents, BetSlip, GameFilter, SerieFilter, Matches, Shield, BetSlipFloat } from "components/Esports";
import { connect } from 'react-redux';
import { getGames, getMatches, getMatchesBySeries } from "controllers/Esports/EsportsUser";
import { getSkeletonColors } from "../../lib/helpers";
import _ from 'lodash';
import "./index.css";

class Esports extends Component {

    constructor(props){
        super(props);
        this.state = {
            gameFilter: [],
            serieFilter: [],
            games: [],
            matches: [],
            slides: [],
            status: ["pre_match", "live"],
            size: 10,
            isLoading: true,
            isLoadingMatches: true
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

        this.setState({ isLoading: true, isLoadingMatches: true });
        const images = require.context('assets/esports', true);

        let games = await getGames();
        games = games.filter(g => g.series.length > 0).map(g => {
            g.image = images('./' + g.slug + '-ico.png');
            return g;
        });

        const matches = await getMatches({
            status, 
            size
        });

        let slides = matches.filter(m => m.live_embed_url != null);
        slides = slides.length > 0 ? slides : matches;

        this.setState({
            games,
            matches,
            slides,
            isLoading: false,
            isLoadingMatches: false
        });
    }

    handlerGameFilterClick = async (gameFilter) => {
        let { games, matches, status, size } = this.state;

        this.setState({ isLoadingMatches: true });

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

        this.setState({ gameFilter, matches, isLoadingMatches: false });
    }

    handlerCleanGameFilterClick = async (gameFilter) => {
        const { status, size } = this.state;

        this.setState({ isLoadingMatches: true });

        const matches = await getMatches({
            status, 
            size
        });

        this.setState({ gameFilter, matches, isLoadingMatches: false });
    }

    handlerSerieFilterClick = async (serieFilter) => {
        const { status } = this.state;

        this.setState({ isLoadingMatches: true });

        const matches = serieFilter.length > 0 ? await getMatchesBySeries({serie_id: serieFilter, status}): await getMatches({status});

        this.setState({ serieFilter, matches, isLoadingMatches: false });
    }

    handlerCleanSerieFilterClick = async (serieFilter) => {
        const { status, size } = this.state;

        this.setState({ isLoadingMatches: true });

        const matches = await getMatches({
            status, 
            size
        });

        this.setState({ serieFilter, matches, isLoadingMatches: false });
    }

    goToMatch(slug, id) {
        this.props.history.push(`/esports/${slug}-${id}`);
    }

    renderSlides() {
        const { slides, games } = this.state;
        let slidesElements = [];

        slides.slice(0, 3).map( match => {
            const gameImage = games.find(g => g.external_id === match.videogame.id).image;
            const images = require.context('assets/esports', true);
            const backgroundImage = images('./' + match.videogame.slug + '.jpg');

            slidesElements.push(
                <div styleName="element" onClick={() => this.goToMatch(match.slug, match.id)}>
                    {
                        match.live_embed_url != null
                        ?
                            <div styleName="background">
                                <iframe
                                    src={`${match.live_embed_url}&parent=${window.location.hostname}`}
                                    height="250"
                                    width="100%"
                                    frameborder="false"
                                    scrolling="false"
                                    allowfullscreen="false"
                                >
                                </iframe>
                            </div>
                        :
                            <div styleName="background" style={{background: "url('" + backgroundImage + "') center center / cover no-repeat"}} />
                    }
                    <div styleName="text">
                        <div styleName="tour">
                            <div styleName="tour-img">
                                <Shield image={gameImage} size={"small"} isFull={true} />
                            </div>
                            <div>
                                <Typography variant={'x-small-body'} color={'white'}>{`${match.league.name} - ${match.serie.full_name}`}</Typography>
                            </div>
                        </div>
                        <Opponents gameImage={gameImage} match={match}/>
                    </div>
                </div>
            );
        });

        return slidesElements;
    }

    handlerAllMatchesClick() {
        const { games, matches } = this.state;

        this.props.history.push({
            pathname: '/esports/matches',
            state: { 
                games,
                matches
            }
        });
    }

    render() {
        const { history } = this.props;
        const { matches, games, size, isLoading, isLoadingMatches, gameFilter } = this.state;

        return (
            <div styleName="root">
                <BetSlipFloat />
                <div styleName="main">
                    <div styleName="highlight">
                        <Typography variant={'h2'} color={'white'} weight={'bold'}>eSports Beting is Live</Typography>
                        <div styleName="intro">
                            <Typography variant={'small-body'} color={'white'}>Watch and bet on CSGO, Data, LoL, Overwatch and many more games. Safe and secure, with 100% player funds protection.</Typography>
                        </div>
                        <div styleName="button">
                            <Button theme="action">
                                <Typography color={'fixedwhite'} variant={'small-body'}>More Info</Typography>
                            </Button>
                        </div>
                    </div>
                    <div styleName="carousel">
                        {isLoading ?
                            <SkeletonTheme color={ getSkeletonColors().color} highlightColor={ getSkeletonColors().highlightColor}>
                                <div style={{opacity : '0.5'}}> 
                                    <Skeleton height={350} width={"80%"}/>
                                </div>
                            </SkeletonTheme>
                        :
                            <DimensionCarousel slides={this.renderSlides()} autoplay={true} interval={3000} />
                        }
                    </div>
                </div>
                <div styleName="results">
                    <div styleName="filters">
                        <GameFilter 
                            games={games}
                            onCleanGameFilter={this.handlerCleanGameFilterClick}
                            onGameFilter={this.handlerGameFilterClick}
                            isLoading={isLoadingMatches}
                        />
                        <SerieFilter
                            games={games}
                            onCleanSerieFilter={this.handlerCleanSerieFilterClick}
                            onSerieFilter={this.handlerSerieFilterClick}
                            isLoading={isLoadingMatches}
                            gameFilter={gameFilter}
                        />
                    </div>
                    <div styleName="matches">
                        <div>
                            <Matches 
                                matches={matches}
                                games={games}
                                size={size}
                                isLoading={isLoadingMatches}
                                history={history}
                            />
                            <div styleName="all-matches">
                                <Button size={'x-small'} theme="primary" onClick={() => this.handlerAllMatchesClick()}>
                                    <Typography color={'fixedwhite'} variant={'x-small-body'}>See All Matches</Typography>
                                </Button>
                            </div>
                        </div>
                        <div styleName="right">
                            <BetSlip />
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

export default connect(mapStateToProps)(Esports);