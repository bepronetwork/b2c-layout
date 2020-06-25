import React, { Component } from "react";
import { Typography, Button, LiveIcon } from 'components';
import { connect } from 'react-redux';
import Carousel from 'react-bootstrap/Carousel'
import classNames from "classnames";
import { games, tournaments, matches } from './fakeData';
import { Link } from "react-router-dom";
import _ from 'lodash';
import "./index.css";
import BetSlip from "../../components/Esports/BetSlip";

class Esports extends Component {

    constructor(props){
        super(props);
        this.state = {
            gameFilter: [],
            tournamentFilter: [],
            betsSlip: []
        };
    }

    renderSlides() {

        let slides = [];

        matches.map( match => {
            slides.push(
                <Carousel.Item>
                    <Link to={`/esports/${match.id}`}>
                        <div styleName="element">
                            <div styleName="background" style={{background: "url('" + match.image + "') center center / cover no-repeat"}} />
                            <div styleName="text">
                                <div styleName="tour">
                                    <img src={match.tournament.game.image} />
                                    <div>
                                        <Typography variant={'x-small-body'} color={'white'}>{`${match.tournament.name} - ${match.round}`}</Typography>
                                    </div>
                                </div>
                                <div styleName="teams">
                                    <div styleName="team">
                                        <img src={match.teams[0].country} />
                                        <img src={match.teams[0].flag} />
                                        <Typography variant={'x-small-body'} color={'white'}>{match.teams[0].name}</Typography>
                                    </div>
                                    <div styleName="triangle">
                                        <div styleName="right-arrow"></div>
                                        <div styleName="vs"><Typography variant={'x-small-body'} color={'grey'}>VS</Typography></div>
                                        <div styleName="left-arrow"></div>
                                    </div>
                                    <div styleName="team">
                                        <img src={match.teams[1].country} />
                                        <img src={match.teams[1].flag} />
                                        <Typography variant={'x-small-body'} color={'white'}>{match.teams[1].name}</Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </Carousel.Item>
            );
        });

        return slides;
    }

    handleFilterGameClick(id) {
        const { gameFilter } = this.state;
        const exist = gameFilter.some(el => el === id); 

        if(exist) {
            const index = gameFilter.indexOf(id);
            gameFilter.splice(index, 1);
        }
        else {
            gameFilter.push(id);
        }

        this.setState({ gameFilter });
    }

    handleCleanGameFilterClick() {
        const { gameFilter } = this.state;

        gameFilter.splice(0, gameFilter.length);

        this.setState({ gameFilter });
    }

    handleFilterTournamentClick(id) {
        const { tournamentFilter } = this.state;
        const exist = tournamentFilter.some(el => el === id); 

        if(exist) {
            const index = tournamentFilter.indexOf(id);
            tournamentFilter.splice(index, 1);
        }
        else {
            tournamentFilter.push(id);
        }

        this.setState({ tournamentFilter });
    }

    handleCleanTournamentFilterClick() {
        const { tournamentFilter } = this.state;

        tournamentFilter.splice(0, tournamentFilter.length);

        this.setState({ tournamentFilter });
    }


    render() {
        const { gameFilter, tournamentFilter } = this.state;

        return (
            <div styleName="root">
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
                        <Carousel pause="hover" interval={1500}>
                            {this.renderSlides()}
                        </Carousel>
                    </div>
                </div>
                <div styleName="results">
                    <div styleName="filters">
                        <div styleName="filter-matches">
                            <div styleName="all" onClick={() => this.handleCleanGameFilterClick()}>
                                <Typography variant={'x-small-body'} color={'white'}>All Games</Typography>
                                {
                                    gameFilter.length 
                                    ?
                                        <span styleName="all-selected">x</span>
                                    :
                                        null
                                }
                            </div>
                            <ul>
                                {
                                    games.map(game => {
                                        const exist = gameFilter.some(el => el === game.id);
                                        const styles = classNames("filter-match", {
                                            selected: exist
                                        });
                                        return (
                                            <li styleName={styles} onClick={() => this.handleFilterGameClick(game.id)} key={game.id}>
                                                <img src={game.image} />
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                        <div styleName="filter-tournaments">
                            <div styleName="all" onClick={() => this.handleCleanTournamentFilterClick()}>
                                    <Typography variant={'x-small-body'} color={'white'}>All Tournaments</Typography>
                                    {
                                    tournamentFilter.length 
                                    ?
                                        <span styleName="all-selected">x</span>
                                    :
                                        null
                                    }
                                </div>
                                <ul>
                                    {
                                        tournaments.map(tournament => {
                                            const exist = tournamentFilter.some(el => el === tournament.id);
                                            const styles = classNames("tournament", {
                                                tourSelected: exist
                                            });
                                            return (
                                                <li styleName={styles} onClick={() => this.handleFilterTournamentClick(tournament.id)} key={tournament.id}>
                                                    <img src={tournament.game.image} />
                                                    <Typography variant={'x-small-body'} color={'white'}>{tournament.name}</Typography>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                    </div>
                    <div>
                        <div styleName="date">
                            <Typography variant={'x-small-body'} color={'grey'}>26 march 2020</Typography>
                        </div>
                        <div styleName="matches">
                            <div>
                                {
                                    matches.map(match => {
                                        return (
                                            <Link to={`/esports/${match.id}`}>
                                                <div styleName="match">
                                                    <div styleName="match-tour">
                                                        <div styleName="tour-name">
                                                            <img src={match.tournament.game.image} />
                                                            <div styleName="match-name">
                                                                <Typography variant={'x-small-body'} color={'white'}> {match.tournament.name}</Typography>
                                                                <span>
                                                                    <Typography variant={'x-small-body'} color={'grey'}>{match.round}</Typography>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div styleName="live live-mobile">
                                                            {
                                                                match.isVideoTransmition === true
                                                                ?
                                                                    <LiveIcon/>
                                                                :
                                                                    null
                                                            }
                                                            {
                                                                match.isLive === true
                                                                ?
                                                                    <Button size={'x-small'} theme="primary">
                                                                        <Typography color={'fixedwhite'} variant={'x-small-body'}>Live</Typography>
                                                                    </Button>
                                                                :
                                                                    null
                                                            }
                                                        </div>
                                                    </div>
                                                    <div styleName="teams">
                                                        <div styleName="team">
                                                            <img src={match.teams[0].country} />
                                                            <img src={match.teams[0].flag} />
                                                            <div>
                                                                <Typography variant={'x-small-body'} color={'white'}>{match.teams[0].name}</Typography>
                                                                <span>
                                                                    <Typography variant={'x-small-body'} color={'grey'}>{match.teams[0].score}</Typography>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div styleName="triangle">
                                                            <div styleName="right-arrow"></div>
                                                            <div styleName="vs"><Typography variant={'x-small-body'} color={'grey'}>VS</Typography></div>
                                                            <div styleName="left-arrow"></div>
                                                        </div>
                                                        <div styleName="team">
                                                            <img src={match.teams[1].country} />
                                                            <img src={match.teams[1].flag} />
                                                            <div>
                                                                <Typography variant={'x-small-body'} color={'white'}>{match.teams[1].name}</Typography>
                                                                <span>
                                                                    <Typography variant={'x-small-body'} color={'grey'}>{match.teams[1].score}</Typography>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div styleName="live live-desktop">
                                                        {
                                                            match.isVideoTransmition === true
                                                            ?
                                                                <LiveIcon/>
                                                            :
                                                                null
                                                        }
                                                        {
                                                            match.isLive === true
                                                            ?
                                                                <Button size={'x-small'} theme="primary">
                                                                    <Typography color={'fixedwhite'} variant={'x-small-body'}>Live</Typography>
                                                                </Button>
                                                            :
                                                                null
                                                        }
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    })
                                }
                            </div>
                            <div styleName="right">
                                <BetSlip/>
                            </div>
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