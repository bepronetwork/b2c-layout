import React, { Component } from "react";
import { Typography, Button } from 'components';
import { Shield, Opponents, Status, BetSlip} from "components/Esports";
import { connect } from 'react-redux';
import Carousel from 'react-bootstrap/Carousel'
import classNames from "classnames";
import { Link } from "react-router-dom";
import { getGames, getMatches, getMatchesBySeries } from "controllers/Esports/EsportsUser";
import Tooltip from '@material-ui/core/Tooltip';
import _ from 'lodash';
import "./index.css";

class Esports extends Component {

    constructor(props){
        super(props);
        this.state = {
            gameFilter: [],
            serieFilter: [],
            betsSlip: [],
            games: [],
            matches: [],
            status: ["pre_match", "live"]
        };
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }


    projectData = async (props) => {
        const { status } = this.state;
        const games = await getGames();
        const matches = await getMatches(status);

        this.setState({
            games,
            matches
        })
    }

    handleFilterGameClick = async (id) => {
        let { gameFilter, games, matches, status } = this.state;
        const exist = gameFilter.some(el => el === id); 

        if(exist) {
            const index = gameFilter.indexOf(id);
            gameFilter.splice(index, 1);
        }
        else {
            gameFilter.push(id);
        }

        if(gameFilter.length > 0) {
            const filtered = games.filter(g => gameFilter.includes(g.external_id));
            const series = filtered.flatMap(item => item.series);
            const serieFilter = series.map(s => {
                return s.id
            });
            matches = await getMatchesBySeries(serieFilter, status);
        }
        else {
            matches = await getMatches(status);
        }

        this.setState({ gameFilter, matches });
    }

    handleCleanGameFilterClick = async () => {
        const { gameFilter, status } = this.state;

        gameFilter.splice(0, gameFilter.length);

        const matches = await getMatches(status);

        this.setState({ gameFilter, matches });
    }

    handleFilterSerieClick = async (id) => {
        const { serieFilter, status } = this.state;
        const exist = serieFilter.some(el => el === id); 

        if(exist) {
            const index = serieFilter.indexOf(id);
            serieFilter.splice(index, 1);
        }
        else {
            serieFilter.push(id);
        }

        const matches = serieFilter.length > 0 ? await getMatchesBySeries(serieFilter, status): await getMatches(status);

        this.setState({ serieFilter, matches });
    }

    handleCleanSerieFilterClick = async () => {
        const { serieFilter, status } = this.state;

        serieFilter.splice(0, serieFilter.length);

        const matches = await getMatches(status);

        this.setState({ serieFilter, matches });
    }

    renderSlides() {

        const { matches, games } = this.state;
        let slides = [];

        matches.slice(0, 3).map( match => {
            const gameImage = games.find(g => g.external_id === match.videogame.id).image;
            slides.push(
                <Carousel.Item>
                    <Link to={`/esports/${match.id}`}>
                        <div styleName="element">
                            <div styleName="background" style={{background: "url('https://i.mlcdn.com.br/portaldalu/fotosconteudo/55652.jpg') center center / cover no-repeat"}} />
                            <div styleName="text">
                                <div styleName="tour">
                                    <div styleName="tour-img">
                                        <img src={gameImage} />
                                    </div>
                                    
                                    <div>
                                        <Typography variant={'x-small-body'} color={'white'}>{`${match.league.name} - ${match.serie.full_name}`}</Typography>
                                    </div>
                                </div>
                                <Opponents opponents={match.opponents} results={match.results} gameImage={gameImage} odds={match.odds}/>
                            </div>
                        </div>
                    </Link>
                </Carousel.Item>
            );
        });

        return slides;
    }

    filterGame() {
        const { gameFilter, games } = this.state;

        return (
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
                            const exist = gameFilter.some(el => el === game.external_id);
                            const styles = classNames("filter-match", {
                                selected: exist
                            });
                            return (
                                <li styleName={styles} onClick={() => this.handleFilterGameClick(game.external_id)} key={game.external_id}>
                                    <Tooltip title={game.name} >
                                        <Shield image={game.image} size={"large"} />
                                    </Tooltip>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }

    filterSerie() {
        const { serieFilter, games } = this.state;

        return (
            <div styleName="filter-tournaments">
                <div styleName="all" onClick={() => this.handleCleanSerieFilterClick()}>
                        <Typography variant={'x-small-body'} color={'white'}>All Tournaments</Typography>
                        {
                        serieFilter.length 
                        ?
                            <span styleName="all-selected">x</span>
                        :
                            null
                        }
                </div>
                <ul>
                    {
                        games.map(game => {
                            if(!_.isEmpty(game.series)) {
                                const exist = serieFilter.some(el => el === game.series[0].id);
                                const styles = classNames("tournament", {
                                    tourSelected: exist
                                });
                                return (
                                    <li styleName={styles} onClick={() => this.handleFilterSerieClick(game.series[0].id)} key={game.series[0].id}>
                                        <Shield image={game.image} size={"small"} />
                                        <div styleName="tournament-name">
                                            <Typography variant={'x-small-body'} color={'white'}>{`${game.series[0].league.name} - ${game.series[0].full_name}`}</Typography>
                                        </div>
                                    </li>
                                )
                            }
                        })
                    }
                </ul>
            </div>
        )
    }

    render() {
        const { games, matches } = this.state;

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
                        {this.filterGame()}
                        {this.filterSerie()}
                    </div>
                    <div>
                        <div styleName="date">
                            <Typography variant={'x-small-body'} color={'grey'}>26 march 2020</Typography>
                        </div>
                        <div styleName="matches">
                            <div>
                                {
                                    matches.map(match => {
                                        const gameImage = games.find(g => g.external_id === match.videogame.id).image;
                                        return (
                                            <Link to={`/esports/${match.id}`}>
                                                <div styleName="match">
                                                    <div styleName="match-tour">
                                                        <div styleName="tour-name">
                                                            <Shield image={gameImage} size={"medium"} />
                                                            <div styleName="match-name">
                                                                <Typography variant={'x-small-body'} color={'white'}> {match.league.name}</Typography>
                                                                <span>
                                                                    <Typography variant={'x-small-body'} color={'grey'}>{match.serie.full_name}</Typography>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <Status 
                                                            status={match.status} 
                                                            date={match.begin_at} 
                                                            isMobile={true} 
                                                            hasLiveTransmition={!_.isEmpty(match.live_embed_url)} 
                                                        />
                                                    </div>
                                                    <Opponents 
                                                        opponents={match.opponents} 
                                                        results={match.results}
                                                        odds={match.odds}
                                                        gameImage={gameImage} 
                                                    />
                                                    <Status 
                                                        status={match.status} 
                                                        date={match.begin_at} 
                                                        isMobile={false}
                                                        hasLiveTransmition={!_.isEmpty(match.live_embed_url)} 
                                                    />
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