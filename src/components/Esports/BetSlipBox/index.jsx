import React, { Component } from "react";
import { Typography, InputNumber } from 'components';
import { connect } from 'react-redux';
import CloseCircleIcon from 'mdi-react/CloseCircleIcon';
import { removeBetSlipFromResult, setBetSlipResult } from "../../../redux/actions/betSlip";
import { formatCurrency } from "../../../utils/numberFormatation";
import classNames from "classnames";
import _ from 'lodash';
import "./index.css";
import LockTwoToneIcon from '@material-ui/icons/LockTwoTone';
import { Tooltip } from "@material-ui/core";

class BetSlipBox extends Component {
    async handleRemoveToBetSlip(id) {
        await this.props.dispatch(removeBetSlipFromResult(id));
    }

    async handleAddBetToBetSlip(amount) {
        const { bet, betSlip } = this.props;
        const newBetSlip = betSlip.map(b =>
            b.id === bet.id ? { ...b, amount: amount } : b
        );

        await this.props.dispatch(setBetSlipResult(newBetSlip));
    }

    handleBetAmountChange = value => {
        this.handleAddBetToBetSlip(value);
    };

    render() {
        const { bet, type } = this.props;
        const user = this.props.profile;

        const styles = classNames("section", "odds-section", {
            "section-one" : type === "multiple"
        });
        const stylesControls = classNames("controls", {
            "controls-one" : type === "multiple"
        });

        const returnBet = bet.odd;
        const marketActive = bet.marketActive !== undefined ? bet.marketActive === true : true;

        return (
            <div styleName={marketActive ? "box" : "box with-border"}>
                <div styleName="bet-header">
                    <div styleName="game-section">
                        <img src={bet.image} alt="Bet" />
                    </div>
                    <div>
                        <Typography variant={'x-small-body'} color={'grey'}>
                            {bet.title}
                        </Typography>
                    </div>
                    <div styleName="close-btn">
                        <button type="button" onClick={() => this.handleRemoveToBetSlip(bet.id)}>
                            <CloseCircleIcon color={'white'} size={20}/>
                        </button>
                    </div>
                </div>
                <div>
                    <Typography variant={'small-body'} color={'white'}>
                        {bet.name}
                    </Typography>
                </div>
                <div styleName={stylesControls}>
                    {
                        type === "simple"
                        ?
                            !bet.success
                            ?
                                <div styleName="section section-left">
                                    <InputNumber
                                        name="amount"
                                        title="Bet Amount"
                                        precision={2}
                                        disabled={marketActive === false}
                                        max={(user && !_.isEmpty(user)) ? user.getBalance() : null}
                                        value={bet.amount}
                                        onChange={this.handleBetAmountChange}
                                        type="currency"
                                    />
                                </div>
                            :
                                <div styleName="section section-full">
                                    <Typography variant={'small-body'} color={'casper'}>
                                        Your bet was done.
                                    </Typography>
                                </div>
                        :
                            null
                    }
                    {
                        !bet.success
                        ?
                            <div styleName={styles}>
                                <span styleName="group right">
                                    <Typography variant={'small-body'} color={'casper'}>
                                        {returnBet}
                                    </Typography>
                                    { bet.status && bet.status !== 'stable' && <div styleName={`arrow ${bet.status}`}/> }
                                </span>
                            </div>
                        : 
                            null
                    }
                </div>
                {
                    type === "simple"
                    ?
                        <div styleName="return">
                            { marketActive === false ? <Tooltip title="This game is blocked, please remove it" placement="top">
                                <div styleName="lock-icon-background">
                                    <LockTwoToneIcon style={{ color: 'white' }} fontSize="small"/>
                                </div>
                            </Tooltip> : <div/> }
                            <Typography variant={'x-small-body'} color={'grey'}>
                                to return: {formatCurrency(bet.amount * returnBet)}
                            </Typography>
                        </div>
                    :
                    marketActive === false ? <Tooltip title="This game is blocked, please remove it" placement="top">
                        <div styleName="lock-icon-background">
                            <LockTwoToneIcon style={{ color: 'white' }} fontSize="small"/>
                        </div>
                    </Tooltip> : null
                }
            </div>
        )

    }
}

function mapStateToProps(state){
    return {
        profile : state.profile,
        betSlip: state.betSlip
    };
}

export default connect(mapStateToProps)(BetSlipBox);