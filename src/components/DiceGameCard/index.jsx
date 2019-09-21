import React, { Component } from "react";
import PropTypes from "prop-types";
import { InputNumber, Slider, ButtonIcon, Typography, AnimationNumber } from "components";
import { startCase } from "lodash";
import { find } from "lodash";

import "./index.css";
import { getPopularNumbers } from "../../lib/api/app";
import { Numbers } from "../../lib/ethereum/lib";

const minPayout = 1.0102;
const maxPayout = 49.5;
const middlePayout = 2;
const middleRoll = 50;


const defaultState = {
    rollType: "over",
    chance: Number("49.5000"),
    payout: Number("2.0000"),
    edge : 0,
    popularNumbers : []
}


export default class DiceGameCard extends Component {
    static propTypes = {
        result: PropTypes.number,
        disableControls: PropTypes.bool,
        onResultAnimation: PropTypes.func.isRequired,
        onChangeRollAndRollType: PropTypes.func.isRequired
    };

    static defaultProps = {
        result: null,
        disableControls: false
    };

    constructor(props) {
        super(props);

        this.state = {
            ...defaultState,
            result: props.result
        };
    }

    componentDidMount(){
        this.projectData(this.props);
        this.getBets(this.props);
      
    }

    componentWillReceiveProps(props){
        this.projectData(props);
        //this.getBets(props);
    }

    async getBets(props){
        let res_popularNumbers = await getPopularNumbers({size : 15});
        var gamePopularNumbers = find(res_popularNumbers, { game: props.game._id });
        if(gamePopularNumbers){
            this.setState({...this.state,
                popularNumbers : gamePopularNumbers.numbers.sort((a, b) => b.resultAmount - a.resultAmount)
            })    
        }
    }

    projectData(props){
        let result = null;
        let nextProps = props;
        let prevState = this.state;
        const { rollNumber } = this.props;
        if (nextProps.result && nextProps.result !== prevState.result) {
            let history = localStorage.getItem("diceHistory");
            const win = !!(
                (nextProps.result >= rollNumber && prevState.rollType === "over") ||
                (nextProps.result < rollNumber && prevState.rollType === "under")
            );

            history = history ? JSON.parse(history) : [];
            history.unshift({ value: nextProps.result, win });
            localStorage.setItem("diceHistory", JSON.stringify(history));
            result = nextProps.result;
            this.setState({...this.state, 
                result
            });
        }else{
            this.setState({
                edge : props.game.edge
            });
            // Nothing
        }
    }

    handlePayout = payout => {
        const { onChangeRollAndRollType } = this.props;
        const { rollType } = this.state;

        let newRoll = 0;

        if (payout === middlePayout) {
        newRoll = middleRoll;
        } else {
        newRoll =
            rollType === "over"
            ? (middleRoll * middlePayout - 100 * payout) / (payout * -1)
            : (middleRoll * middlePayout) / payout;
        }

        this.setState({
            payout,
            chance: rollType === "over" ? 100 - newRoll : newRoll
        });

        onChangeRollAndRollType(newRoll, rollType);
    };

    handleChance = value => {
        const { onChangeRollAndRollType } = this.props;
        const { rollType } = this.state;

        const newRoll = rollType === "over" ? 100 - value : value;

        const payout = this.getPayout(newRoll);

        this.setState({
            chance: value,
            payout
        });

        onChangeRollAndRollType(newRoll, rollType);
    };

    handleRoll = () => {
        const { onChangeRollAndRollType, rollNumber } = this.props;
        const { rollType } = this.state;

        const newRollType = rollType === "over" ? "under" : "over";
        const newRoll = 100 - rollNumber;

        this.setState({
            rollType: newRollType,
            chance: rollType === "over" ? newRoll : rollNumber
        });

        onChangeRollAndRollType(newRoll, newRollType);
    };

    getPayout = roll => {
        const { rollType } = this.state;
        let payout = 0;

        if (roll === middleRoll) {
        payout = middlePayout;
        } else {
        payout =
            rollType === "over"
            ? (middleRoll * middlePayout) / (100 - roll)
            : (middleRoll * middlePayout) / roll;
        }

        return payout;
    };

    handleSlider = value => {
        const { onChangeRollAndRollType } = this.props;
        const { rollType } = this.state;
        const payout = this.getPayout(value);
        let chance = rollType === "over" ? 100 - value : value;        
        this.setState({
            chance: chance,
            payout
        });

        onChangeRollAndRollType(value, rollType);
    };

    getPayoutStep = () => {
        const { rollType } = this.state;
        const { rollNumber } = this.props;

        if (rollType === "over") {
        if (rollNumber < 50) return 0.1;

        if (rollNumber < 75) return 0.5;

        return 2;
        }

        if (rollNumber < 25) return 2;

        if (rollNumber < 50) return 0.5;

        return 0.1;
    };

    renderPopularNumbers = ({popularNumbers}) => {
        if(!popularNumbers || (popularNumbers && popularNumbers.length < 1)){return null}
        const totalAmount = popularNumbers.reduce( (acc, item) => {
            return acc+item.resultAmount;
        }, 0);
        return(
            <div styleName='outer-popular-numbers'>
                <div styleName='inner-popular-numbers'>
                    {popularNumbers.map( item => 
                        {
                            return(
                                <div styleName='popular-number-row'>
                                    <div styleName={`popular-number-container blue-square`}>
                                        <Typography variant={'small-body'} color={'white'}>
                                            {item.key}    
                                        </Typography>       
                                    </div>
                                    <div styleName='popular-number-container-amount'>
                                        <AnimationNumber number={Numbers.toFloat(item.resultAmount/totalAmount*100)} variant={'small-body'} color={'white'} span={'%'}/>
                                    </div>
                                </div>
                            )
                        }
                    )}
                </div>
            </div>
        )
    }

    render() {
        let { rollType, chance, payout, popularNumbers } = this.state;
        const { result, disableControls, onResultAnimation, rollNumber, bet, animating } = this.props;
        let winEdge = (100-(this.state.edge))/100;
        payout = payout * winEdge;
        return (
        <div styleName="root">
            <div styleName="container">
            {this.renderPopularNumbers({popularNumbers})}
            <div styleName="slider">
                <div styleName="slider-container">
                <Slider
                    onChange={this.handleSlider}
                    animating={animating}
                    roll={rollType}
                    bet={bet}
                    value={rollNumber}
                    result={result}
                    disableControls={disableControls}
                    onResultAnimation={onResultAnimation}
                />
                <ButtonIcon
                    onClick={this.handleRoll}
                    icon="rotate"
                    label="Reverse roll"
                    rollType={rollType}
                />
                </div>
            </div>
            <div styleName="values">
                <div styleName="values-container">
                <InputNumber
                    name="payout"
                    min={minPayout}
                    max={maxPayout}
                    precision={4}
                    step={this.getPayoutStep()}
                    title="Payout"
                    onChange={this.handlePayout}
                    icon="cross"
                    value={payout}
                />
                <InputNumber
                    name="roll"
                    icon="rotate"
                    title={`Roll ${startCase(rollType)}`}
                    precision={2}
                    disabled
                    step={0.5}
                    value={rollNumber}
                />
                <InputNumber
                    name="chance"
                    precision={4}
                    min={2}
                    max={98}
                    unit="%"
                    title="Win Chance"
                    onChange={this.handleChance}
                    value={chance}
                    step="any"
                />
                </div>
            </div>
            </div>
        </div>
        );
    }
}
