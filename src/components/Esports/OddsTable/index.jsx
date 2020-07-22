import React, { Component } from "react";
import { Typography } from 'components';
import { connect } from 'react-redux';
import classNames from "classnames";
import CloseIcon from "components/Icons/CloseCross";
import { setBetSlipResult, removeBetSlipFromResult } from "../../../redux/actions/betSlip";
import { formatOpponentData, formatOpponentBet, formatDrawBet } from "../../../lib/helpers";
import _ from 'lodash';
import "./index.css";


class OddsTable extends Component {

    constructor(props){
        super(props);
        this.state = {
            opponent1: {
                id: null,
                image: "https://dummyimage.com/50/e2e2e2/fff.png",
                name: "Team 1",
                odd: null
            },
            opponent2: {
                id: null,
                image: "https://dummyimage.com/50/e2e2e2/fff.png",
                name: "Team 2",
                odd: null
            },
            drawOdd: null,
            matchName: "Team 1 x Team 2",
            matchId: null,
            gameImage: null,
            isLoaded: false
        };
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        const { match } = props;
        let { opponent1, opponent2, drawOdd } = this.state;

        const images = require.context('assets/esports', true);
        const gameImage = images('./' + match.videogame.slug + '-ico.png');

        if(match.odds != null) {
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
            isLoaded: true
        });
    }

    async handleAddToBetSlip(bet) {
        const { betSlip } = this.props;
        let arrBets = _.isEmpty(betSlip) ? [] : betSlip;
        arrBets.push(bet);

        await this.props.dispatch(setBetSlipResult(arrBets));
    }

    async handleRemoveToBetSlip(id) {
        await this.props.dispatch(removeBetSlipFromResult(id));
    }

    render() {
        const { betSlip } = this.props;
        const { opponent1, opponent2, matchName, matchId, gameImage, isLoaded, drawOdd } = this.state;

        if(!isLoaded) { return null };

        const drawId = parseInt(opponent1.odd.participant_id + "" + opponent2.odd.participant_id);

        const mainStyles = classNames("bets-placar", {
            "bets-placar-3" : drawOdd != null
        });

        const isOpponent1Selected = !_.isEmpty(betSlip) ? betSlip.some(b => b.id === opponent1.odd.participant_id) : false;
        const opponent1Styles = classNames("bets-team", {
            selected : isOpponent1Selected
        });

        const isOpponent2Selected = !_.isEmpty(betSlip) ? betSlip.some(b => b.id === opponent2.odd.participant_id) : false;
        const opponent2Styles = classNames("bets-team", {
            selected : isOpponent2Selected
        });

        const isDrawSelected = !_.isEmpty(betSlip) ? betSlip.some(b => b.id === drawId) : false;
        const drawStyles = classNames("bets-team", {
            selected : isDrawSelected
        });

        const opponent1Bet = formatOpponentBet(opponent1, matchId, matchName, 0);

        const opponent2Bet = formatOpponentBet(opponent2, matchId, matchName, 0);

        const drawBet = drawOdd != null ? formatDrawBet(drawId, drawOdd, matchId, matchName, gameImage, 0) : null;

        return (
            <div styleName="bets-menu">
                <div>
                    <div styleName="bets-title">
                        <Typography variant={'small-body'} color={'white'}>Winner, Full Match</Typography>
                    </div>
                    <div styleName={mainStyles}>
                        <div styleName={opponent1Styles} onClick={() => isOpponent1Selected ? this.handleRemoveToBetSlip(opponent1.id) : this.handleAddToBetSlip(opponent1Bet)}>
                            <img src={opponent1.image} />
                            <Typography variant={'x-small-body'} color={'white'}>{opponent1.name}</Typography>
                            <Typography variant={'x-small-body'} color={'white'}>{(1 / opponent1.odd.probability).toFixed(2)}</Typography>
                        </div>
                        {
                            drawOdd != null 
                            ?
                                <div styleName={drawStyles} onClick={() => isDrawSelected ? this.handleRemoveToBetSlip(drawId) : this.handleAddToBetSlip(drawBet)}>
                                    <CloseIcon/>
                                    <Typography variant={'x-small-body'} color={'white'}>Draw</Typography>
                                    <Typography variant={'x-small-body'} color={'white'}>{(1 / drawOdd.probability).toFixed(2)}</Typography>
                                </div>
                            :
                                null
                        }
                        <div styleName={opponent2Styles} onClick={() => isOpponent2Selected ? this.handleRemoveToBetSlip(opponent2.id) : this.handleAddToBetSlip(opponent2Bet)}>
                            <img src={opponent2.image} />
                            <Typography variant={'x-small-body'} color={'white'}>{opponent2.name}</Typography>
                            <Typography variant={'x-small-body'} color={'white'}>{(1 / opponent2.odd.probability).toFixed(2)}</Typography>
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
        ln: state.language,
        betSlip: state.betSlip
    };
}

export default connect(mapStateToProps)(OddsTable);