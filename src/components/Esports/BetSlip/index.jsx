import React, { Component } from "react";
import { Typography, Button, Tabs, InputNumber } from 'components';
import { BetSlipBox } from 'components/Esports';
import { removeAllFromResult } from "../../../redux/actions/betSlip";
import { formatCurrency } from "../../../utils/numberFormatation";
import { websocketUrlEsports } from "../../../lib/api/apiConfig";
import { setBetSlipResult } from "../../../redux/actions/betSlip";
import { setMessageNotification } from "../../../redux/actions/message";
import store from "../../../containers/App/store";
import Dice from "components/Icons/Dice";
import openSocket from 'socket.io-client';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import "./index.css";


class BetSlip extends Component {

    constructor(props){
        super(props);
        this.state = {
            betSlip: null,
            tab: "simple",
            betType: null,
            amount: 0,
            isBetting: false
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

    handleCreateBet = async () => {
        const { profile, currency, onHandleLoginOrRegister } = this.props;
        const { betSlip, tab, amount } = this.state;

        if (!profile || _.isEmpty(profile)) return onHandleLoginOrRegister("register");

        this.setState({
            isBetting: true
        })

        const websocket = openSocket(websocketUrlEsports);

        websocket.on('connect', () => {
            websocket.emit('authenticate', { token: profile.bearerToken })
            .on('authenticated', () => {
                console.log("connected to websocket")
            })
            .on('unauthorized', (msg) => {
                console.log(`unauthorized: ${JSON.stringify(msg.data)}`);
                throw new Error(msg.data.type);
            });
        });

        let newBetSlip = betSlip;

        if (tab == "simple") {
            newBetSlip = betSlip.map(b =>
                { return { ...b, bid: uuidv4() } }
            );

            newBetSlip.filter(bet => bet.success != true).map(bet => {
                websocket.emit("createBet", {
                    bid: bet.bid,
                    app: profile.app_id, 
                    resultSpace: 
                    [{
                        matchId: bet.matchId, 
                        marketType: bet.type, 
                        betType: bet.position, 
                        statistic: bet.probability
                    }], 
                    user: profile.id, 
                    betAmount: bet.amount, 
                    currency: currency._id
                });
            });
        }
        else if (tab == "multiple") {
            const bid = uuidv4();
            newBetSlip = betSlip.filter(bet => bet.success != true).map(b =>
                { return { ...b, bid } }
            );

            const resultSpace = newBetSlip.map(b => {
                return {
                    matchId: b.matchId, 
                    marketType: b.type, 
                    betType: b.position, 
                    statistic: b.probability
                }
            });
 
            websocket.emit("createBet", {
                bid: bid,
                app: profile.app_id, 
                resultSpace: resultSpace, 
                user: profile.id, 
                betAmount: amount, 
                currency: currency._id
            });
        }

        this.setState({ betSlip: newBetSlip });
        await this.props.dispatch(setBetSlipResult(newBetSlip));

        websocket.on("createBetReturn", (res) => {
            const bid = res.bid;

            if(res.success == true) {
                newBetSlip = newBetSlip.map(b =>
                    b.bid == bid ? { ...b, success: res.success } : b
                );
    
                this.props.dispatch(setBetSlipResult(newBetSlip));
                this.setState({ betSlip: newBetSlip });
    
                if (tab == "simple") {
                    const bet = newBetSlip.find(b => b.bid == bid);
                    
                    if(!_.isEmpty(bet)) {
                        profile.updateBalance({ userDelta: (bet.amount * -1)});
                    }
                }
                else if (tab == "multiple") {
                    profile.updateBalance({ userDelta: (amount * -1)});
                }
            }
            else {
                const bet = newBetSlip.find(b => b.bid == bid);

                if(!_.isEmpty(bet)) {
                    const message = (tab == "simple") ? "Error to bet on '" + bet.name + "' in the match '" + bet.title + "'." : "Error in one or more matches in the multiple bet."
                    store.dispatch(setMessageNotification(message));
                }
            }

            this.setState({ isBetting: false });

        });

        this.setState({ betType: tab, betSlip: newBetSlip });
    };

    hasMultipleBetOpponnetsInSameMatch() {
        const { betSlip } = this.state;

        if(_.isEmpty(betSlip)) { return false };

        var valueArr = betSlip.filter(b => b.success != true).map(function(bet){ return bet.matchId });
        var isDuplicate = valueArr.some(function(bet, idx){ 
            return valueArr.indexOf(bet) != idx
        });

        return isDuplicate;
    }

    isBetValid = () => {
        const { betSlip, amount, tab, isBetting } = this.state;
        const isNotAllSuccessBet = _.isEmpty(betSlip) ? false : (betSlip.filter(b => b.success != true).length > 0);
        let isValid = false;

        if(tab == "simple") {
            const isNotFilledAllAmount = betSlip.filter(b => b.amount <= 0).length > 0;

            isValid = !isNotFilledAllAmount;
        }
        else if(tab == "multiple") {
            isValid = (amount > 0 && !this.hasMultipleBetOpponnetsInSameMatch());
        }

        return (isValid && !isBetting && isNotAllSuccessBet);
    };

    render() {
        const user = this.props.profile;
        const { betSlip, tab, amount, betType } = this.state;
        let totalSimpleAmount = 0;
        let totalMultipleOdd = 1;
   
        const isSuccessBet = _.isEmpty(betSlip) ? false : (betSlip.filter(b => b.success == true).length > 0);

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
                                                {
                                                    isSuccessBet == true 
                                                    ?
                                                        <Typography variant={'small-body'} color={'casper'}>
                                                            Your bet was done.
                                                        </Typography>
                                                    :
                                                        <InputNumber
                                                            name="amount"
                                                            title="Bet Amount"
                                                            precision={2}
                                                            disabled={false}
                                                            max={(user && !_.isEmpty(user)) ? user.getBalance() : null}
                                                            value={amount}
                                                            onChange={this.handleBetAmountChange}
                                                        />
                                                }
     
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
                                {
                                    tab == "multiple" && this.hasMultipleBetOpponnetsInSameMatch()
                                    ?
                                        <div styleName="error">
                                            <Typography variant={'small-body'} color={'red'}>
                                                Is not allowed multiple events bet in the same match.
                                            </Typography>
                                        </div>
                                    :
                                        null
                                }
                                <div styleName="button">
                                    <Button fullWidth 
                                            theme="primary" 
                                            onClick={() => this.handleCreateBet()} 
                                            disabled={!this.isBetValid()}
                                            animation={<Dice />}
                                    >
                                        <Typography weight="semi-bold" color="pickled-bluewood">
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
        betSlip: state.betSlip,
        currency: state.currency
    };
}

export default connect(mapStateToProps)(BetSlip);