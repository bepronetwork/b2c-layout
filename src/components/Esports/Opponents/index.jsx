import React, { Component } from "react";
import { Typography } from 'components';
import { Shield } from "components/Esports";
import { connect } from 'react-redux';
import classNames from "classnames";
import CloseIcon from "components/Icons/CloseCross";
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
        const { match, gameImage, isScoreBoard } = props;
        let { opponent1, opponent2, drawOdd } = this.state;

        if(_.isEmpty(match.opponents)) {
            opponent1.image = gameImage;
            opponent2.image = gameImage;
        }
        else {
            const oddType = match.odds.winnerTwoWay.length > 0 ? match.odds.winnerTwoWay : match.odds.winnerThreeWay;
            drawOdd = match.odds.winnerThreeWay.length > 0 ? (oddType.find(o => o.participant_id == null).probability).toFixed(2) : null;

            const opponentId1 = match.opponents[0].opponent.id;
            opponent1.odd = oddType.find(o => o.participant_id == opponentId1);
            opponent1.image = match.opponents[0].opponent.image_url;
            opponent1.name  = match.opponents[0].opponent.name;
            opponent1.location  = match.opponents[0].opponent.location;
            opponent1.score = match.results.find(r => r.team_id ==opponentId1).score;
            opponent1.id = opponentId1;

            const opponentId2 = match.opponents[1].opponent.id;
            opponent2.odd = oddType.find(o => o.participant_id == opponentId2);
            opponent2.image = match.opponents[1].opponent.image_url;
            opponent2.name  = match.opponents[1].opponent.name;
            opponent2.location  = match.opponents[0].opponent.location;
            opponent2.score = match.results.find(r => r.team_id == opponentId2).score;
            opponent2.id = opponentId2;
        }

        this.setState({
            opponent1,
            opponent2,
            drawOdd,            
            matchName: match.name,
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
        const { opponent1, opponent2, isScoreBoard, drawOdd, matchName, isLoaded, status } = this.state;

        if(!isLoaded) { return null };

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

        /*
        const isDrawSelected = !_.isEmpty(betSlip) ? betSlip.some(b => b.id === drawId) : false;
        const drawStyles = classNames("bets-team", {
            selected : isDrawSelected
        });*/

        const opponent1Bet = { 
            id : opponent1.odd.participant_id,
            image : opponent1.image,
            title : matchName,
            name : opponent1.name + " - Winner, Full Match",
            probability : (1 / opponent1.odd.probability).toFixed(2),
            amount: 0
        }

        const opponent2Bet = { 
            id : opponent2.odd.participant_id,
            image : opponent2.image,
            title : matchName,
            name : opponent2.name + " - Winner, Full Match",
            probability : (1 / opponent2.odd.probability).toFixed(2),
            amount: 0
        }


        /*
        const drawId = opponent1.odd.participant_id + "" + opponent2.odd.participant_id;
        const drawBet = { 
            id : drawId,
            image : <CloseIcon />,
            title : matchName,
            name : "Draw - Winner, Full Match",
            probability : drawOdd != null ? (1 / drawOdd.probability).toFixed(2) : 0
        }*/

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
                            {drawOdd == null ? "VS" : drawOdd}
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