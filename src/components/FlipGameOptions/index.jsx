import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  InputNumber,
  ToggleButton,
  Button,
  Typography,
  MultiplyMaxButton,
  OnWinLoss
} from "components";
import UserContext from "containers/App/UserContext";
import betSound from "assets/bet-sound.mp3";
import Sound from "react-sound";
import Dice from "components/Icons/Dice";
import delay from 'delay';
import "./index.css";
import { Numbers } from "../../lib/ethereum/lib";
import _ from 'lodash';
import { isUserSet } from "../../lib/helpers";
import { formatCurrency } from "../../utils/numberFormatation";
import { CopyText } from '../../copy';
import { connect } from "react-redux";

class FlipGameOptions extends Component {
    static contextType = UserContext;

    static propTypes = {
        onBet: PropTypes.func.isRequired,
        disableControls: PropTypes.bool
    };

    state = {
        type: "manual",
        betAmount: 0,
        side: "heads",
        bets: 1,
        profitStop: 0,
        lossStop: 0,
        edge : 0,
        onBet : false,
        onWin: null,
        onLoss: null,
        sound: false
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


    handleType = type => {
        this.setState({ type });
    };

    handleSide = side => {
        this.setState({ side });
    };

    handleBetAmountChange = value => {
        this.setState({
            betAmount: value
        });
    };

    handleMultiplyResult = result => {
        result.toString().length > 6 ?
          this.setState({ betAmount: result.toFixed(6) })
          :
          this.setState({ betAmount: result });
      }
    
    

    isBetValid = () => {
        const { profile } = this.props;
        const { disableControls } = this.props;
        const { betAmount } = this.state;

        return (betAmount > 0 && !disableControls) || !profile;
    };

    handleBet = async () => {
        const { onBet, profile } = this.props;
        const { type, bets, profitStop, lossStop, onWin, onLoss, side} = this.state;
        var betAmount = this.state.betAmount;
        
        if (this.isBetValid()) {
            // to be completed with the other options
            this.setState({ sound: true });
            switch(type){
                case 'manual' : {
                    await onBet({ amount : betAmount, side });
                    break;
                };
                case 'auto' : {
                    if(!isUserSet(profile)){return null};
                    this.setState({isAutoBetting : true})
                    var totalProfit = 0, totalLoss = 0, lastBet = 0, wasWon = 0;
                    for( var i = 0; i < bets ; i++){
                        if(
                            (profitStop == 0  || totalProfit <= profitStop) && // Stop Profit
                            (lossStop == 0 || totalLoss <= lossStop) // Stop Loss
                        ){
                            if (i != 0) { await delay(2.5*1000); };
                            let { winAmount } = await onBet({amount : betAmount, side});
                            totalProfit += (winAmount-betAmount);
                            totalLoss += (winAmount == 0) ? -Math.abs(betAmount) : 0;
                            wasWon = (winAmount != 0);
                            lastBet = betAmount;
                            if(onWin && wasWon){ betAmount += Numbers.toFloat(betAmount*onWin/100) }; 
                            if(onLoss && !wasWon){ betAmount += Numbers.toFloat(betAmount*onLoss/100) }; 
                            await delay(5*1000);
                            this.setState({bets : bets-(i + 1), betAmount});
                        }
                            
                    }
                    this.setState({isAutoBetting : false})
                    break;
                }
            }
        }
        return true;
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
const copy = CopyText.flipGameOptionsIndex[ln];
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

    renderManual = () => {
        const { betAmount } = this.state;
        let winEdge = (100-(this.state.edge))/100;
        let winAmount = betAmount * winEdge;
        const {ln} = this.props;
        const copy = CopyText.flipGameOptionsIndex[ln];
        return (
        <div>
            <div styleName="element">
            <InputNumber
                name="win-profit"
                title={copy.INDEX.INPUT_NUMBER.TITLE[3]}
                icon="bitcoin"
                precision={2}
                disabled
                value={formatCurrency(winAmount)}
            />
            </div>
        </div>
        );
    };

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
            url={betSound}
            playStatus="PLAYING"
            autoLoad
        />
        );
    };

    handleSongFinishedPlaying = () => {
        this.setState({ sound: false });
    };

    render() {
        const { type, betAmount, side, isAutoBetting } = this.state;
        const { isCoinSpinning } = this.props;
        const user = this.props.profile;
        const {ln, onBetAmount} = this.props;
        const copy = CopyText.flipGameOptionsIndex[ln];

        return (
        <div styleName="root">
            {this.renderSound()}
            <div styleName="toggle">
                <ToggleButton
                    config={{
                    left: { value: "manual", title: copy.INDEX.TOGGLE_BUTTON.TITLE[0] },
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
                        step={0.01}
                        icon="bitcoin"
                        max={(user && !_.isEmpty(user)) ? user.getBalance() : null}
                        precision={2}
                        value={betAmount}
                        onChange={this.handleBetAmountChange}
                        />
                        <MultiplyMaxButton
                            onBetAmount={onBetAmount}
                            amount={betAmount}
                            onResult={this.handleMultiplyResult}
                        />
                    </div>
                </div>
                <div styleName="content">
                    {type === "manual" ? this.renderManual() : this.renderAuto()}
                </div>

                <div styleName="side">
                    <div styleName="label">
                        <Typography variant="small-body" weight="semi-bold" color="casper">
                            {copy.INDEX.TYPOGRAPHY.TEXT[1]}
                        </Typography>
                    </div>
                    <ToggleButton
                        config={{
                        left: { value: "heads", title: copy.INDEX.TOGGLE_BUTTON.TITLE[2], color: "red" },
                        right: { value: "tails", title: copy.INDEX.TOGGLE_BUTTON.TITLE[3], color: "tree-poppy" }
                        }}
                        selected={side}
                        differentBorders
                        onSelect={this.handleSide}
                        size="full"
                    />
                </div>
                <div styleName="button">
                    <Button
                        fullWidth
                        theme="primary"
                        disabled={!this.isBetValid()|| isCoinSpinning  || isAutoBetting}
                        onClick={this.handleBet}
                        animation={<Dice />}
                    >
                        <Typography weight="semi-bold" color="pickled-bluewood">
                        {type === "manual" ? copy.INDEX.TYPOGRAPHY.TEXT[2] : copy.INDEX.TYPOGRAPHY.TEXT[3]}
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

export default connect(mapStateToProps)(FlipGameOptions);