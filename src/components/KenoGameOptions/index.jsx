import React, { Component } from "react";
import UserContext from "containers/App/UserContext";
import PropTypes from "prop-types";
import {
  InputNumber,
  ToggleButton,
  Button,
  Typography,
  MultiplyMaxButton,
  OnWinLoss
} from "components";
import betSound from "assets/bet-sound.mp3";
import Sound from "react-sound";
import Dice from "components/Icons/Dice";
import _ from 'lodash';
import { CopyText } from '../../copy';
import { connect } from "react-redux";
import { isUserSet } from "../../lib/helpers";
import { Numbers } from "../../lib/ethereum/lib";
import delay from 'delay';

import "./index.css";
class KenoGameOptions extends Component {
    static contextType = UserContext;

    static propTypes = {
        onBet: PropTypes.func.isRequired,
        disableControls: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.state = {
            type: "manual",
            amount: 0,
            isAutoBetting : false,
            bets: 1,
            profitStop: 0,
            lossStop: 0,
            onWin: null,
            edge : 0,
            onLoss: null,
            sound: false
        };
    }

    handleType = type => {
        this.setState({ type });
    };

    isBetValid = () => {
        const { user } = this.context;
        const { disableControls } = this.props;
        const { amount } = this.state;

        return (amount > 0 && !disableControls) || !user;
    };

    isInAutoBet = () => this.state.isAutoBetting;

    renderSound = () => {
        const { sound } = this.state;
        const soundConfig = localStorage.getItem("sound");

        if (!sound || soundConfig !== "on") {
        return null;
        }

        return (
            <Sound
                onFinishedPlaying={this.handleSongFinishedPlaying}
                volume={100}
                useConsole={false}
                url={betSound}
                playStatus="PLAYING"
                autoLoad
            />
        );
    };

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData(props){
        this.setState({...this.state, 
            edge : props.game.edge
        });
    }

    handleSongFinishedPlaying = () => {
        this.setState({ sound: false });
    };

    betAction = ({amount}) => {
        const { onBet } = this.props;
        return new Promise( (resolve, reject) => {
            try{
                setTimeout( async () => {
                    let res = await onBet({ amount });
                    resolve(res)
                },2*1000)
            }catch(err){
                console.log(err)
                reject(err)
            }

        })
    }

    handleBet = async (callback) => {
        const { onBet, profile } = this.props;
        const { amount, type, bets, profitStop, lossStop, onWin, onLoss} = this.state;
        var res;

        if (this.isBetValid()) {
            // to be completed with the other options
            this.setState({ sound: true });
            switch(type){
                case 'manual' : {
                    res = await onBet({ amount });
                    break;
                };
                case 'auto' : {
                    if(!isUserSet(profile)){return null};
                    this.setState({isAutoBetting : true})
                    var totalProfit = 0, totalLoss = 0, lastBet = 0, wasWon = 0;
                    var betAmount = amount;
                    for( var i = 0; i < bets ; i++){
                        if(
                            (profitStop == 0  || totalProfit <= profitStop) && // Stop Profit
                            (lossStop == 0 || totalLoss <= lossStop) // Stop Loss
                        ){
                            await delay(1.5*1000);
                            const res = await this.betAction({amount : betAmount});
                            if(!_.isEmpty(res)) {
                                let { winAmount } = res;
                                totalProfit += (winAmount-betAmount);
                                totalLoss += (winAmount == 0) ? -Math.abs(betAmount) : 0;
                                wasWon = (winAmount != 0);
                                lastBet = betAmount;
                                if(onWin && wasWon){ betAmount += Numbers.toFloat(betAmount*onWin/100) }; 
                                if(onLoss && !wasWon){ betAmount += Numbers.toFloat(betAmount*onLoss/100) }; 
                            }
                            else {
                                break;
                            }
                        }
                            
                    }
                    this.setState({isAutoBetting : false})
                    break;
                }
            }
        }
        return true;
    };

    handleBetAmountChange = value => {
        const { onBetAmount } = this.props;
        this.setState({
            amount: value
        });

        onBetAmount(value);
    };
    
    handleOnWin = value => {
        this.setState({ onWin: value });
    };

    handleOnLoss = value => {
        this.setState({ onLoss: value });
    };

    handleBets = value => {
        this.setState({ bets: value });
    };

    handleStopOnProfit = value => {
        this.setState({ profitStop: value });
    };

    handleStopOnLoss = value => {
        this.setState({ lossStop: value });
    };

    renderAuto = () => {
        const { bets, profitStop, lossStop, onWin, onLoss } = this.state;
        const {ln} = this.props;
        const copy = CopyText.plinkoGameOptionsIndex[ln];
        return (
            <div>
                <div styleName="element">
                    <InputNumber
                        name="bets"
                        min={1}
                        title={copy.INDEX.INPUT_NUMBER.TITLE[0]}
                        value={bets}
                        onChange={this.handleBets}
                    />
                </div>
                <div styleName="element">
                    <OnWinLoss value={onWin} title={copy.INDEX.ON_WIN_LOSS.TITLE[0]} onChange={this.handleOnWin} />
                </div>
                <div styleName="element">
                    <OnWinLoss
                        value={onLoss}
                        title={copy.INDEX.ON_WIN_LOSS.TITLE[1]}
                        onChange={this.handleOnLoss}
                    />
                </div>
                <div styleName="element">
                    <InputNumber
                        name="profit"
                        step={0.01}
                        title={copy.INDEX.INPUT_NUMBER.TITLE[1]}
                        icon="bitcoin"
                        precision={2}
                        value={profitStop}
                        onChange={this.handleStopOnProfit}
                />
                </div>
                <div styleName="element">
                    <InputNumber
                        name="loss"
                        step={0.01}
                        precision={2}
                        title={copy.INDEX.INPUT_NUMBER.TITLE[2]}
                        icon="bitcoin"
                        value={lossStop}
                        onChange={this.handleStopOnLoss}
                    />
                </div>
            </div>
        );
    };

    handleMultiply = value => {
        const { profile, onBetAmount } = this.props;
        const { amount } = this.state;
        let newAmount = amount;

        if(_.isEmpty(profile)) { return null };

        let balance = profile.getBalance();

        if (value === "max") {
        newAmount = balance;
        }

        if (value === "2") {
        newAmount = newAmount === 0 ? 0.01 : newAmount * 2;
        }

        if (value === "0.5") {
        newAmount = newAmount === 0.01 ? 0 : newAmount * 0.5;
        }

        if (newAmount > balance) {
        newAmount = balance;
        }

        this.setState({ amount: newAmount });
        onBetAmount(newAmount);
    };

    render() {
        const { type, amount, isAutoBetting } = this.state;
        const user = this.props.profile;
        const { ln } = this.props;
        const copy = CopyText.kenoGameOptionsIndex[ln];

        return (
        <div styleName="root">
            {this.renderSound()}
            <div styleName="toggle">
                <ToggleButton
                    config={{
                        left: { value: "manual", title: copy.INDEX.TOGGLE_BUTTON.TITLE[0]},
                        right: { value: "auto", title: copy.INDEX.TOGGLE_BUTTON.TITLE[1]}
                    }}
                    selected={type}
                    size="full"
                    differentBorders
                    onSelect={this.handleType}
                />
            </div>
            <div styleName="bet-properties">
                <div styleName="amount">
                    <Typography variant="small-body" weight="semi-bold" color="casper">
                        {copy.INDEX.TYPOGRAPHY.TEXT[0]}
                    </Typography>
                    <div styleName="amount-container">
                        <InputNumber
                            name="amount"
                            value={amount}
                            max={(user && !_.isEmpty(user)) ? user.getBalance() : null}
                            step={0.01}
                            icon="bitcoin"
                            precision={2}
                            onChange={this.handleBetAmountChange}
                            />
                        <MultiplyMaxButton onSelect={this.handleMultiply} />
                    </div>
                    <div styleName="content">
                        {type === "manual" ? null : this.renderAuto()}
                    </div>
                </div>
            
                <div styleName="button">
                    <Button
                        disabled={!this.isBetValid() || this.isInAutoBet()}
                        onClick={this.handleBet}
                        fullWidth
                        theme="primary"
                        animation={<Dice />}
                    >
                        <Typography weight="semi-bold" color="pickled-bluewood">
                            {type === "manual" ? copy.INDEX.TYPOGRAPHY.TEXT[1] : copy.INDEX.TYPOGRAPHY.TEXT[2]}
                        </Typography>
                    </Button>
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


export default connect(mapStateToProps)(KenoGameOptions);