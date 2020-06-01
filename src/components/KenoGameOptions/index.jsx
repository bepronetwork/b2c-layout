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
import Dice from "components/Icons/Dice";
import _ from 'lodash';
import { CopyText } from '../../copy';
import { connect } from "react-redux";

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
        const { onBet, cards } = this.props;
        const { amount, type } = this.state;
        var res;

        if (this.isBetValid()) {
            // to be completed with the other options
            this.setState({ sound: true });
            switch(type){
                case 'manual' : {
                    res = await onBet({ cards, amount });
                    break;
                };
                case 'auto' : {
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

    renderAuto = () => {
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
        const { ln, cards } = this.props;
        const copy = CopyText.kenoGameOptionsIndex[ln];
        return (
        <div styleName="root">
            {this.renderSound()}
            <div styleName="toggle">
                <ToggleButton
                    config={{
                        left: { value: "manual", title: copy.INDEX.TOGGLE_BUTTON.TITLE[0]},
                        right: { value: "auto", title: copy.INDEX.TOGGLE_BUTTON.TITLE[1], disabled : true}
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
                </div>
            
                <div styleName="button">
                    <Button
                        disabled={!this.isBetValid() || this.isInAutoBet() || cards.length === 0}
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