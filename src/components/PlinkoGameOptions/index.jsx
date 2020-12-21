import React, { Component } from "react";
import UserContext from "containers/App/UserContext";
import PropTypes from "prop-types";
import {
  InputNumber,
  ToggleButton,
  Button,
  Typography,
  MultiplyMaxButton
} from "components";
import betSound from "assets/bet-sound.mp3";
import Sound from "react-sound";
import Plinko from "components/Icons/Plinko";
import { isUserSet } from "../../lib/helpers";
import { Numbers } from "../../lib/ethereum/lib";
import delay from 'delay';
import _ from 'lodash';
import "./index.css";
import { CopyText } from '../../copy';
import { connect } from "react-redux";

class PlinkoGameOptions extends Component {

    static contextType = UserContext;

    static propTypes = {
        onBet: PropTypes.func.isRequired,
        disableControls: PropTypes.bool
    };

    static defaultProps = {
        disableControls: false
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
        this.setState({
            edge : props.game.edge
        });
    }

    handleSongFinishedPlaying = () => {
        this.setState({ sound: false });
    };

    betAction = ({amount}) => {
        const { onBet } = this.props;
        return new Promise( async (resolve, reject) => {
            try{
                let res = await onBet({ amount });
                resolve(res)
            }catch(err){
                reject(err)
            }

        });
    }

    handleBet = async () => {
        const { onBet, profile } = this.props;
        const { amount, type, bets, profitStop, lossStop, onWin, onLoss} = this.state;

        if (this.isBetValid()) {
            this.setState({ sound: true });
            switch(type){
                case 'manual' : {
                    await onBet({ amount });
                    break;
                };
                case 'auto' : {
                    if(!isUserSet(profile)){return null};
                    this.setState({isAutoBetting : true})
                    var totalProfit = 0, totalLoss = 0, wasWon = 0;
                    var betAmount = amount;
                    for( var i = 0; i < bets ; i++){
                        if(
                            (profitStop == 0  || totalProfit <= profitStop) &&
                            (lossStop == 0 || totalLoss <= lossStop)
                        ){
                            if (i != 0) { await delay(4*1000); };
                            const res = await this.betAction({amount : betAmount});
                            if(!_.isEmpty(res)) {
                                let { winAmount } = res;
                                totalProfit += (winAmount-betAmount);
                                totalLoss += (winAmount == 0) ? -Math.abs(betAmount) : 0;
                                wasWon = (winAmount != 0);
                                if(onWin && wasWon){ betAmount += Numbers.toFloat(betAmount*onWin/100) }; 
                                if(onLoss && !wasWon){ betAmount += Numbers.toFloat(betAmount*onLoss/100) }; 
                                await delay(4*1000);
                                this.setState({bets : bets-(i + 1), amount: betAmount});
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
        this.setState({
            amount: value
        });
    };

    handleBets = value => {
        this.setState({ bets: value });
    };

    renderAuto = () => {
        const { bets } = this.state;
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
        </div>
        );
    };

    handleMultiplyResult = result => {
        result.toString().length > 6 ?
          this.setState({ amount: result.toFixed(6) })
          :
          this.setState({ amount: result });
      }
    

    render() {
        const { type, amount } = this.state;
        const user = this.props.profile;
        const {ln} = this.props;
            const copy = CopyText.plinkoGameOptionsIndex[ln];

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
                            max={(user && !_.isEmpty(user)) ? user.getBalanceWithBonus().toFixed(6) : null}
                            step={0.01}
                            icon="bitcoin"
                            precision={2}
                            onChange={this.handleBetAmountChange}
                            />
                        <MultiplyMaxButton amount={amount} onResult={this.handleMultiplyResult} />
                    </div>
                </div>
                <div styleName="content">
                    {type === "auto" ? this.renderAuto() : <div />}
                </div>
                <div styleName="button">
                    <Button
                        disabled={!this.isBetValid() || this.isInAutoBet()}
                        onClick={this.handleBet}
                        fullWidth
                        theme="primary"
                        animation={<Plinko />}
                    >
                        <Typography weight="semi-bold" color="pickled-bluewood">
                            {type === "manual" ? copy.INDEX.TYPOGRAPHY.TEXT[1]: copy.INDEX.TYPOGRAPHY.TEXT[2]  }
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

export default connect(mapStateToProps)(PlinkoGameOptions);