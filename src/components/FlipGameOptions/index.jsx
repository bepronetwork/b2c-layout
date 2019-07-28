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

export default class FlipGameOptions extends Component {
    static contextType = UserContext;

    static propTypes = {
        onBet: PropTypes.func.isRequired,
        disableControls: PropTypes.bool
    };

    static defaultProps = {
        disableControls: false
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

    handleMultiply = value => {
        const { user } = this.context;
        const { betAmount } = this.state;
        let newAmount = betAmount;

        if (value === "max") {
        newAmount = user.balance;
        }

        if (value === "2") {
        newAmount = newAmount === 0 ? 0.01 : newAmount * 2;
        }

        if (value === "0.5") {
        newAmount = newAmount === 0.01 ? 0 : newAmount * 0.5;
        }

        if (newAmount > user.balance) {
        newAmount = user.balance;
        }

        this.setState({ betAmount : newAmount });
    };

    isBetValid = () => {
        const { user } = this.context;
        const { disableControls } = this.props;
        const { betAmount } = this.state;
        return (
        (user && betAmount > 0 && user.balance >= betAmount && !disableControls) || !user);
    };

    handleBet = async () => {
        const { onBet } = this.props;
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
                    this.setState({isAutoBetting : true})
                    var totalProfit = 0, totalLoss = 0, lastBet = 0, wasWon = 0;
                    for( var i = 0; i < bets ; i++){
                        if(
                            (profitStop == 0  || totalProfit <= profitStop) && // Stop Profit
                            (lossStop == 0 || totalLoss <= lossStop) // Stop Loss
                        ){
                            await delay(4*1000);
                            let { winAmount } = await onBet({amount : betAmount, side});
                            totalProfit += (winAmount-betAmount);
                            totalLoss += (winAmount == 0) ? -Math.abs(betAmount) : 0;
                            wasWon = (winAmount != 0);
                            lastBet = betAmount;
                            if(onWin && wasWon){ betAmount += Numbers.toFloat(betAmount*onWin/100) }; 
                            if(onLoss && !wasWon){ betAmount += Numbers.toFloat(betAmount*onLoss/100) }; 
                        
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

        return (
        <div>
            <div styleName="element">
                <InputNumber
                    name="bets"
                    min={1}
                    title="Number of Bets"
                    value={bets}
                    onChange={this.handleBets}
                />
            </div>
            <div styleName="element">
                <OnWinLoss value={onWin} title="On Win" onChange={this.handleOnWin} />
            </div>
            <div styleName="element">
                <OnWinLoss
                    value={onLoss}
                    title="On Loss"
                    onChange={this.handleOnLoss}
                />
            </div>
            <div styleName="element">
                <InputNumber
                    name="profit"
                    step={0.01}
                    title="Stop on Profit"
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
                    title="Stop on Loss"
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
        return (
        <div>
            <div styleName="element">
            <InputNumber
                name="win-profit"
                title="Profit on Win"
                icon="bitcoin"
                precision={2}
                disabled
                value={winAmount}
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
        const { isCoinSpinning, onBetTrigger } = this.props;
        const { user } = this.context;

        return (
        <div styleName="root">
            {this.renderSound()}
            <div styleName="toggle">
            <ToggleButton
                config={{
                left: { value: "manual", title: "Manual" },
                right: { value: "auto", title: "Auto"}
                }}
                selected={type}
                size="full"
                differentBorders
                onSelect={this.handleType}
            />
            </div>
            <div styleName="amount">
            <Typography variant="small-body" weight="semi-bold" color="casper">
                Bet Amount
            </Typography>
            <div styleName="amount-container">
                <InputNumber
                name="amount"
                step={0.01}
                icon="bitcoin"
                max={user ? user.balance : null}
                precision={2}
                value={betAmount}
                onChange={this.handleBetAmountChange}
                />
                <MultiplyMaxButton onSelect={this.handleMultiply} />
            </div>
            </div>
            <div styleName="content">
            {type === "manual" ? this.renderManual() : this.renderAuto()}
            </div>

            <div styleName="side">
            <div styleName="label">
                <Typography variant="small-body" weight="semi-bold" color="casper">
                Choose Side
                </Typography>
            </div>
            <ToggleButton
                config={{
                left: { value: "heads", title: "Heads", color: "red" },
                right: { value: "tails", title: "Tails", color: "tree-poppy" }
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
                disabled={!this.isBetValid()|| onBetTrigger || isCoinSpinning  || isAutoBetting}
                onClick={this.handleBet}
                animation={<Dice />}
            >
                <Typography weight="semi-bold" color="pickled-bluewood">
                {type === "manual" ? "Bet" : "Start AutoBet"}
                </Typography>
            </Button>
            </div>
        </div>
        );
    }
}
