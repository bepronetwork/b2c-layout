import React, { Component } from "react";
import { Typography } from 'components';
import { Shield } from "components/Esports";
import { connect } from 'react-redux';
import classNames from "classnames";
import { formatOpponentData, formatOpponentBet, formatDrawBet } from "../../../lib/helpers";
import ReactCountryFlag from "react-country-flag"
import { setBetSlipResult, removeBetSlipFromResult } from "../../../redux/actions/betSlip";
import _ from 'lodash';
import "./index.css";


class Opponents extends Component {

    constructor(props) {
        super(props);
        this.state = {
            opponent1: {
                location: null,
                image: null,
                name: "Team 1",
                score: 0,
                odd: null
            },
            opponent2: {
                location: null,
                image: null,
                name: "Team 2",
                score: 0,
                odd: null
            },
            drawOdd: null,
            matchName: "Team 1 x Team 2",
            matchId: null,
            gameImage: null,
            isScoreBoard: false,
            isLoaded: false,
            status: null
        };
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        const { match, isScoreBoard } = props;
        let { opponent1, opponent2, drawOdd } = this.state;

        const images = require.context('assets/esports', true);
        const gameImage = images('./' + match.videogame.slug + '-ico.png');

        if(_.isEmpty(match.opponents)) {
            opponent1.image = gameImage;
            opponent2.image = gameImage;
        }
        else {
            const oddType = match.odds.winnerTwoWay.length > 0 ? match.odds.winnerTwoWay : match.odds.winnerThreeWay;
            drawOdd = match.odds.winnerThreeWay.length > 0 ? oddType.find(o => o.participant_id == null) : null;

            opponent1 = formatOpponentData(match, 0, gameImage);
            
            opponent2 = formatOpponentData(match, 1, gameImage);
        }

        this.setState({
            opponent1,
            opponent2,
            drawOdd,            
            matchName: match.name,
            matchId: match.id,
            gameImage,
            isScoreBoard: isScoreBoard === true ? true : false,
            isLoaded: true,
            status: match.status
        });
    }

    async handleAddToBetSlip(event, bet) {
        event.stopPropagation();
        const { betSlip } = this.props;
        let arrBets = _.isEmpty(betSlip) ? [] : betSlip;
        arrBets.push(bet);

        await this.props.dispatch(setBetSlipResult(arrBets));
    }

    async handleRemoveToBetSlip(event, id) {
        event.stopPropagation();

        await this.props.dispatch(removeBetSlipFromResult(id));
    }

    render() {
        const { betSlip } = this.props;
        const { opponent1, opponent2, isScoreBoard, drawOdd, matchName, matchId, gameImage, isLoaded, status } = this.state;

        if(!isLoaded) { return null };

        const drawId = opponent1.odd.participant_id + "" + opponent2.odd.participant_id;

        const isOpponent1Selected = !_.isEmpty(betSlip) ? betSlip.some(b => b.id === opponent1.odd.participant_id) : false;
        const team1Styles = classNames("team", {
            "team1" : !isScoreBoard,
            "team-score-board" : isScoreBoard,
            "selected" : !isScoreBoard && isOpponent1Selected
        });

        const isOpponent2Selected = !_.isEmpty(betSlip) ? betSlip.some(b => b.id === opponent2.odd.participant_id) : false;
        const team2Styles = classNames("team", {
            "team2" : !isScoreBoard,
            "team-score-board" : isScoreBoard,
            "selected" : !isScoreBoard && isOpponent2Selected
        });

        const isDrawSelected = !_.isEmpty(betSlip) ? betSlip.some(b => b.id === drawId) : false;
        const drawStyles = classNames("draw", {
            "selected" : !isScoreBoard && isDrawSelected
        });

        const opponent1Bet = formatOpponentBet(opponent1, matchId, matchName, 0);

        const opponent2Bet = formatOpponentBet(opponent2, matchId, matchName, 0);

        const drawBet = drawOdd != null ? formatDrawBet(drawId, drawOdd, matchId, matchName, gameImage, 0) : null;

        return (
            <div styleName="teams">
                <div styleName={team1Styles} onClick={(event) => {isOpponent1Selected ? this.handleRemoveToBetSlip(event, opponent1.id) : this.handleAddToBetSlip(event, opponent1Bet)}}>
                    <ReactCountryFlag
                        countryCode={opponent1.location}
                        svg
                        style={{
                            width: '0.9em',
                            height: '0.9em',
                        }}
                        title={opponent1.location}
                    />
                    <Shield image={opponent1.image} size={"small"} />
                    <div styleName="name">
                        <Typography variant={'x-small-body'} color={'white'}>{opponent1.name}</Typography>
                        {
                            opponent1.odd != null
                            ?
                                <span>
                                    <Typography variant={'x-small-body'} color={'grey'}>{(1 / opponent1.odd.probability).toFixed(2)}</Typography>
                                </span>
                            :
                                null
                        }
                    </div>
                </div>
                {
                    isScoreBoard === true
                    ?
                        status != "pre_match" 
                        ?
                        <div styleName="score">
                            <div><Typography variant={'small-body'} color={'white'} weight={"bold"}>{opponent1.score}</Typography></div>
                            <div styleName="vs"><Typography variant={'x-small-body'} color={'grey'}>:</Typography></div>
                            <div><Typography variant={'small-body'} color={'white'} weight={"bold"}>{opponent2.score}</Typography></div>
                        </div>
                        :
                        <div styleName="score">
                            <div styleName="vs"><Typography variant={'x-small-body'} color={'grey'}>VS</Typography></div>
                        </div>
                    :
                        <div styleName="vs">
                            <Typography variant={'x-small-body'} color={'grey'}>
                            {
                                drawOdd == null 
                                ? 
                                    "VS" 
                                : 
                                    <div styleName={drawStyles} onClick={(event) => {isDrawSelected ? this.handleRemoveToBetSlip(event, drawId) : this.handleAddToBetSlip(event, drawBet)}}>
                                        <Typography variant={'x-small-body'} color={'grey'}>DRAW</Typography>
                                        <Typography variant={'x-small-body'} color={'white'}>{(1 / drawOdd.probability).toFixed(2)}</Typography>
                                    </div>
                            }
                            </Typography>
                        </div>

                }
                 <div styleName={team2Styles} onClick={(event) => {isOpponent2Selected ? this.handleRemoveToBetSlip(event, opponent2.id) : this.handleAddToBetSlip(event, opponent2Bet)}}>
                    <ReactCountryFlag
                        countryCode={opponent2.location}
                        svg
                        style={{
                            width: '0.9em',
                            height: '0.9em',
                        }}
                        title={opponent2.location}
                    />
                    <Shield image={opponent2.image} size={"small"} />
                    <div styleName="name">
                        <Typography variant={'x-small-body'} color={'white'}>{opponent2.name}</Typography>
                        {
                            opponent2.odd != null
                            ?
                                <span>
                                    <Typography variant={'x-small-body'} color={'grey'}>{(1 / opponent2.odd.probability).toFixed(2)}</Typography>
                                </span>
                            :
                                null
                        }
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        profile : state.profile,
        ln: state.language,
        betSlip: state.betSlip
    };
}

export default connect(mapStateToProps)(Opponents);