import React, { Component } from "react";
import { Typography } from 'components';
import { connect } from 'react-redux';
import classNames from "classnames";
import { betSlips } from '../../../containers/Esports/fakeData';
import { setBetSlipResult, removeBetSlipFromResult } from "../../../redux/actions/betSlip";
import _ from 'lodash';
import "./index.css";


class BetsTable extends Component {

    constructor(props){
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
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

        const { match, betSlip } = this.props;
        var slips = betSlips.filter(s => s.match === match.id);

        return (
            <div styleName="bets-menu">
                {
                    slips.map((s, index) => {
                        return (
                            <div key={s.id}>
                                <div styleName="bets-title">
                                    <Typography variant={'small-body'} color={'white'}>{s.title}</Typography>
                                </div>
                                {
                                    index === 0 
                                    ?
                                        <div styleName="bets-placar">
                                            {
                                                s.options.map(o => {
                                                    const bet = { 
                                                        id : s.id,
                                                        match : s.match,
                                                        title : s.title,
                                                        option : o
                                                    }
                                                    const selected = !_.isEmpty(betSlip) ? betSlip.some(b => b.option.id === o.id) : false;
                                                    const styles = classNames("bets-team", {
                                                        selected
                                                    });
                                                    return (
                                                        <div key={o.id} styleName={styles} onClick={() => selected ? this.handleRemoveToBetSlip(o.id) : this.handleAddToBetSlip(bet)}>
                                                            <img src={o.flag} />
                                                            <Typography variant={'x-small-body'} color={'white'}>{o.name}</Typography>
                                                            <Typography variant={'x-small-body'} color={'white'}>{o.value}</Typography>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    :
                                        <div styleName="bet-option">
                                            {
                                                s.options.map(o => {
                                                    const bet = { 
                                                        id : s.id,
                                                        match : s.match,
                                                        title : s.title,
                                                        option : o
                                                    }
                                                    const selected = !_.isEmpty(betSlip) ? betSlip.some(b => b.option.id === o.id) : false;
                                                    const styles = classNames("option-team", {
                                                        selected
                                                    });
                                                    return (
                                                        <div key={o.id} styleName={styles} onClick={() => selected ? this.handleRemoveToBetSlip(o.id) : this.handleAddToBetSlip(bet)}>
                                                            <Typography variant={'x-small-body'} color={'white'}>{o.name}</Typography>
                                                            <Typography variant={'x-small-body'} color={'white'}>{o.value}</Typography>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                }
                            </div>
                        )
                    })
                }
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

export default connect(mapStateToProps)(BetsTable);