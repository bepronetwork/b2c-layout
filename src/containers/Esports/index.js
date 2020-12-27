import React, { Component } from "react";
import { Typography, Button, DimensionCarousel } from 'components';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { Opponents, BetSlip, GameFilter, SerieFilter, Matches, Shield, BetSlipFloat } from "components/Esports";
import { connect } from 'react-redux';
import { getGames, getMatches, getMatchesBySeries } from "controllers/Esports/EsportsUser";
import { getSkeletonColors, getAppCustomization } from "../../lib/helpers";
import classNames from "classnames";
import _ from 'lodash';
import "./index.css";
import LockTwoToneIcon from '@material-ui/icons/LockTwoTone';

class Esports extends Component {

    constructor(props){
        super(props);
        this.state = {
            gameFilter: [],
            games: [],
            matches: [],
            slides: [],
            status: ["pre_match", "live"],
            size: 10,
            isLoading: true,
            isLoadingMatches: true,
            hasHighlight: true,
            highlight: null
        };
    }

    componentDidMount(){
        this.projectData()
    }

    UNSAFE_componentWillReceiveProps(){
        this.projectData();
    }

    projectData = async () => {
        const { status, size } = this.state;

        this.setState({ isLoading: true, isLoadingMatches: true });
        const { esportsScrenner } = await getAppCustomization();
        const hasHighlight = esportsScrenner.title || esportsScrenner.subtitle || esportsScrenner.button_text ? true : false;

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

        let slides = matches.filter(m => !_.isEmpty(m.live_embed_url));
        slides = slides.length < 3 ? slides.concat(matches) : matches;

        this.setState({
            games,
            matches,
            slides,
            hasHighlight,
            highlight: esportsScrenner,
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

        this.setState({ matches, isLoadingMatches: false });
    }

    handlerCleanSerieFilterClick = async () => {
        const { status, size } = this.state;

        this.setState({ isLoadingMatches: true });

        const matches = await getMatches({
            status, 
            size
        });

        this.setState({ matches, isLoadingMatches: false });
    }

    goToMatch(slug, id) {
        this.props.history.push(`/esports/${slug}-${id}`);
    }

    onHighlightClick(url) {
        if(url) {
            window.location.assign(url);
        }
    }

    renderHighlight() {
        const { highlight, isLoading } = this.state;

        return (
            isLoading ?
                <SkeletonTheme color={ getSkeletonColors().color} highlightColor={ getSkeletonColors().highlightColor}>
                    <div style={{opacity : '0.5'}}> 
                        <div styleName="highlight">
                            <Skeleton width={"300"} height={"50"}/>
                            <div styleName="intro">
                                <Skeleton width={"200"} height={"80"}/>
                            </div>
                            <div styleName="button">                     
                                <Skeleton width={"100"} height={"50"}/>
                            </div>
                        </div>
                    </div>
                </SkeletonTheme>
            :
                <div styleName="highlight">
                    <Typography variant={'h2'} color={'white'} weight={'bold'}>{highlight.title}</Typography>
                    <div styleName="intro">
                        <Typography variant={'small-body'} color={'white'}>{highlight.subtitle}</Typography>
                    </div>
                    <div styleName="button">                     
                        {highlight.button_text &&  highlight.link_url ?
                            <Button theme="action" onClick={() => this.onHighlightClick(highlight.link_url)} theme="action">
                                <Typography color={'fixedwhite'} variant={'small-body'}>{highlight.button_text}</Typography>
                            </Button>
                        : 
                            null
                        }
                    </div>
                </div>
        );
    }

    isActiveMarket = match => {
        return match.market ? match.market.status === 'active' : false;
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
                        match.live_embed_url !== null
                        ?
                            <div styleName="background">
                                <iframe
                                    src={`${match.live_embed_url}&muted=true&parent=${window.location.hostname}`}
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
                        <div styleName="group-left">
                            { !this.isActiveMarket(match) && <div styleName="lock-icon-background">
                                <LockTwoToneIcon style={{ color: 'white' }} fontSize="inherit"/>
                            </div> }    
                            <Opponents gameImage={gameImage} match={match}/>
                        </div>
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
        const { history, onHandleLoginOrRegister } = this.props;
        const { matches, games, size, isLoading, isLoadingMatches, gameFilter, hasHighlight } = this.state;

        const mainStyles = classNames("main", {
            "main-unique": !hasHighlight
        });

        return (
            <div styleName="root">
                <BetSlipFloat onHandleLoginOrRegister={onHandleLoginOrRegister}/>
                <div styleName={mainStyles}>
                    {this.renderHighlight()}
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
                            isLoading={isLoading}
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
                            <BetSlip onHandleLoginOrRegister={onHandleLoginOrRegister}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Esports;