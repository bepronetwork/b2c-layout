import React, { Component } from "react";
import { Typography, Button, Tabs, InputNumber } from 'components';
import { BetSlipBox } from 'components/Esports';
import { removeAllFromResult } from "../../../redux/actions/betSlip";
import { formatCurrency } from "../../../utils/numberFormatation";
import { bet } from "controllers/Esports/EsportsUser";
import { connect } from 'react-redux';
import _ from 'lodash';
import "./index.css";


class BetSlip extends Component {

    constructor(props){
        super(props);
        this.state = {
            betSlip: null,
            tab: "simple",
            amount: 0
        };
    }

    componentDidMount() {
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = (props) => {
        const { betSlip } = props;

        this.setState({
            betSlip
        });
    }

    handleTabChange = async (name) => {
        this.setState({ tab: name });
    };

    async handleRemoveAll() {
        await this.props.dispatch(removeAllFromResult(null));
    }

    handleBetAmountChange = value => {
        this.setState({
            amount: value
        });
    };

    handleCreateBet = () => {
        const { profile } = this.props;
        const { betSlip, tab, amount } = this.state;
        //const { app, matchId, user } = params;
        console.log("betSlip", betSlip[0].matchId)
        const params = {
            app: profile.app.id,
            user: profile.id,
            matchId: betSlip[0].matchId
        }
        bet(params, profile.bearerToken);
    };

    render() {
        const user = this.props.profile;
        const { betSlip, tab, amount } = this.state;
        let totalSimpleAmount = 0;
        let totalMultipleOdd = 1;

        return (
            <div>
                {(_.isEmpty(betSlip)) 
                    ?
                        <div styleName="empty">
                            <Typography variant={'x-small-body'} color={'grey'}>
                                You haven’t selected any bets yet
                            </Typography>
                        </div>
                    :
                    <div>
                        <Tabs
                            selected={tab}
                            options={[
                            {
                                value: "simple",
                                label: `Simple (${betSlip.length})`
                            },
                            {   
                                value: "multiple", 
                                label: "Multiple"
                            }
                            ]}
                            onSelect={this.handleTabChange}
                            style="full-background"
                        />
                        <div>
                            <div styleName="betslip-header">
                                <button styleName="clear-all" type="button" onClick={() => this.handleRemoveAll()}>
                                    <Typography variant={'x-small-body'} color={'grey'}>
                                        Clear all
                                    </Typography>
                                </button>
                            </div>
                            <div styleName="bet-slip">
                                {betSlip.map(bet => {
                                    totalSimpleAmount += (bet.amount * (1 / bet.probability));
                                    totalMultipleOdd = totalMultipleOdd * (1 / bet.probability);
                                    return (
                                        <BetSlipBox bet={bet} type={tab} />
                                    )
                                })}
                                <div styleName="total-returns">
                                    {
                                        tab == "multiple"
                                        ?
                                            <div styleName="multiple-info">
                                                <InputNumber
                                                    name="amount"
                                                    title="Bet Amount"
                                                    precision={2}
                                                    disabled={false}
                                                    max={(user && !_.isEmpty(user)) ? user.getBalance() : null}
                                                    value={amount}
                                                    onChange={this.handleBetAmountChange}
                                                />
                                                <div styleName="return">
                                                    <Typography variant={'x-small-body'} color={'grey'}>
                                                        Odds: 
                                                    </Typography>
                                                    <Typography variant={'small-body'} color={'white'}>
                                                        {totalMultipleOdd.toFixed(2)}
                                                    </Typography>
                                                </div>
                                                <div styleName="return">
                                                    <Typography variant={'x-small-body'} color={'grey'}>
                                                        Total returns: 
                                                    </Typography>
                                                    <Typography variant={'small-body'} color={'white'}>
                                                        {formatCurrency(totalMultipleOdd * amount)}
                                                    </Typography>
                                                </div>
                                            </div>
                                        :
                                            <div styleName="return">
                                                <Typography variant={'x-small-body'} color={'grey'}>
                                                    Total returns: 
                                                </Typography>
                                                <Typography variant={'small-body'} color={'white'}>
                                                    {formatCurrency(totalSimpleAmount)}
                                                </Typography>
                                            </div>
                                    }
                                </div>
                                <div styleName="button">
                                    <Button fullWidth theme="primary" onClick={() => this.handleCreateBet()}>
                                        <Typography weight="semi-bold" color="fixedwhite">
                                            Bet
                                        </Typography>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
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

export default connect(mapStateToProps)(BetSlip);