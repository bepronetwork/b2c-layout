import React, { Component } from "react";
import { Typography } from 'components';
import { connect } from 'react-redux';
import classNames from "classnames";
import { setBetSlipResult, removeBetSlipFromResult } from "../../../redux/actions/betSlip";
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
            matchName: "Team 1 x Team 2",
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
        const { opponent1, opponent2 } = this.state;

        if(match.odds != null) {
            const opponentId1 = match.opponents[0].opponent.id;
            opponent1.odd = match.odds.winnerTwoWay.find(o => o.participant_id == opponentId1);
            opponent1.image = match.opponents[0].opponent.image_url;
            opponent1.name  = match.opponents[0].opponent.name;
            opponent1.id  = match.opponents[0].opponent.id;

            const opponentId2 = match.opponents[1].opponent.id;
            opponent2.odd = match.odds.winnerTwoWay.find(o => o.participant_id == opponentId2);
            opponent2.image = match.opponents[1].opponent.image_url;
            opponent2.name  = match.opponents[1].opponent.name;
            opponent2.id  = match.opponents[1].opponent.id;
        }

        this.setState({
            opponent1,
            opponent2,
            matchName: match.name,
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
        const { opponent1, opponent2, matchName, isLoaded } = this.state;

        if(!isLoaded) { return null };

        const isOpponent1Selected = !_.isEmpty(betSlip) ? betSlip.some(b => b.id === opponent1.odd.participant_id) : false;
        const opponent1Styles = classNames("bets-team", {
            selected : isOpponent1Selected
        });

        const isOpponent2Selected = !_.isEmpty(betSlip) ? betSlip.some(b => b.id === opponent2.odd.participant_id) : false;
        const opponent2Styles = classNames("bets-team", {
            selected : isOpponent2Selected
        });

        const opponent1Bet = { 
            id : opponent1.odd.participant_id,
            image : opponent1.image,
            title : matchName,
            name : opponent1.name + " - Winner, Full Match",
            probability : opponent1.odd.probability
        }

        const opponent2Bet = { 
            id : opponent2.odd.participant_id,
            image : opponent2.image,
            title : matchName,
            name : opponent2.name + " - Winner, Full Match",
            probability : opponent2.odd.probability
        }

        return (
            <div styleName="bets-menu">
                <div>
                    <div styleName="bets-title">
                        <Typography variant={'small-body'} color={'white'}>Winner, Full Match</Typography>
                    </div>
                    <div styleName="bets-placar">
                        <div styleName={opponent1Styles} onClick={() => isOpponent1Selected ? this.handleRemoveToBetSlip(opponent1.id) : this.handleAddToBetSlip(opponent1Bet)}>
                            <img src={opponent1.image} />
                            <Typography variant={'x-small-body'} color={'white'}>{opponent1.name}</Typography>
                            <Typography variant={'x-small-body'} color={'white'}>{opponent1.odd.probability}</Typography>
                        </div>
                        <div styleName={opponent2Styles} onClick={() => isOpponent2Selected ? this.handleRemoveToBetSlip(opponent2.id) : this.handleAddToBetSlip(opponent2Bet)}>
                            <img src={opponent2.image} />
                            <Typography variant={'x-small-body'} color={'white'}>{opponent2.name}</Typography>
                            <Typography variant={'x-small-body'} color={'white'}>{opponent2.odd.probability}</Typography>
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