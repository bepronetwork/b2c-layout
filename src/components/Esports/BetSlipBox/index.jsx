import React, { Component } from "react";
import { Typography, InputNumber } from 'components';
import { connect } from 'react-redux';
import CloseCircleIcon from 'mdi-react/CloseCircleIcon';
import { removeBetSlipFromResult, setBetSlipResult } from "../../../redux/actions/betSlip";
import { formatCurrency } from "../../../utils/numberFormatation";
import classNames from "classnames";
import _ from 'lodash';
import "./index.css";


class BetSlipBox extends Component {

    constructor(props){
        super(props);
        this.state = {
            amount: 0
        };
    }

    componentDidMount() {
    }

    async handleRemoveToBetSlip(id) {
        await this.props.dispatch(removeBetSlipFromResult(id));
    }

    async handleAddBetToBetSlip(amount) {
        const { bet, betSlip } = this.props;
        const newBetSlip = betSlip.map(b =>
            b.id == bet.id ? { ...b, amount: amount } : b
        );

        await this.props.dispatch(setBetSlipResult(newBetSlip));
    }

    handleBetAmountChange = value => {
        this.setState({
            amount: value
        });

        this.handleAddBetToBetSlip(value);
    };

    render() {
        const { bet, type } = this.props;
        const user = this.props.profile;
        const { amount } = this.state;

        const styles = classNames("section", "odds-section", {
            "section-one" : type == "multiple"
        });
        const stylesControls = classNames("controls", {
            "controls-one" : type == "multiple"
        });

        const returnBet = bet.odd;

        return (
            <div styleName="box">
                <div styleName="bet-header">
                    <div styleName="game-section">
                        <img src={bet.image}/>
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
                        type == "simple"
                        ?
                            bet.success != true
                            ?
                                <div styleName="section section-left">
                                    <InputNumber
                                        name="amount"
                                        title="Bet Amount"
                                        precision={2}
                                        disabled={false}
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
                        bet.success != true
                        ?
                            <div styleName={styles}>
                                <Typography variant={'small-body'} color={'casper'}>
                                    {returnBet}
                                </Typography>
                            </div>
                        : 
                            null
                    }
                </div>
                {
                    type == "simple"
                    ?
                        <div styleName="return">
                            <Typography variant={'x-small-body'} color={'grey'}>
                                to return: {formatCurrency(amount * returnBet)}
                            </Typography>
                        </div>
                    :
                        null
                }
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

export default connect(mapStateToProps)(BetSlipBox);