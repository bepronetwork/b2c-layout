import React, { Component } from "react";
import UserContext from "containers/App/UserContext";
import PropTypes from "prop-types";
import {
  InputNumber,
  ToggleButton,
  Button,
  Typography,
  MultiplyMaxButton,
  DropDownGameOptionsField
} from "components";
import betSound from "assets/bet-sound.mp3";
import Sound from "react-sound";
import Plinko from "components/Icons/Plinko";
import { isUserSet } from "../../lib/helpers";
import _ from 'lodash';
import "./index.css";


export default class PlinkoGameOptions extends Component {

    riskOptions = ["Low", "Medium", "High"];

    rowsOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

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

                    //TODO: auto bet algorithm

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
        </div>
        );
    };

    handleMultiply = value => {
        const { profile } = this.props;
        const { amount } = this.state;
        let newAmount = amount;
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
    };

    render() {
        const { type, amount, isAutoBetting } = this.state;
        const user = this.props.profile;
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
            <div styleName="element">
                <DropDownGameOptionsField title="Risk" options={this.riskOptions}/>
            </div>
            <div styleName="element">
                <DropDownGameOptionsField title="Rows" options={this.rowsOptions}/>
            </div>
            <div styleName="content">
            {type === "auto" ? this.renderAuto() : null}
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
                    {type === "manual" ? "Bet" : "Start AutoBet"  }
                </Typography>
            </Button>
            </div>
        </div>
        );
    }
}
