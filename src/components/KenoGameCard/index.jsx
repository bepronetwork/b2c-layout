import React, { Component } from "react";
import PropTypes from "prop-types";
import { InputNumber, Slider, ButtonIcon, Typography, AnimationNumber, StarIcon } from "components";
import { startCase } from "lodash";
import { find } from "lodash";
import { connect } from "react-redux";
import classNames from 'classnames';
import { getPopularNumbers } from "../../lib/api/app";
import { Numbers } from "../../lib/ethereum/lib";
import { formatPercentage } from "../../utils/numberFormatation";
import { CopyText } from '../../copy';
import Keno from './keno';

import "./index.css";

const minPayout = 1.0102;
const maxPayout = 49.5;
const middlePayout = 2;
const middleRoll = 50;

const totalOfCards = 40;
const maxPickedCards = 10;


const defaultState = {
    rollType: "under",
    chance: Number("49.5000"),
    payout: Number("2.0000"),
    edge : 0,
    popularNumbers : [],
    cards: [ 
        { id:  1, isPicked: false, isSelected: false }, { id:  2, isPicked: false, isSelected: false }, { id:  3, isPicked: false, isSelected: false }, { id:  4, isPicked: false, isSelected: false }, 
        { id:  5, isPicked: false, isSelected: false }, { id:  6, isPicked: false, isSelected: false }, { id:  7, isPicked: false, isSelected: false }, { id:  8, isPicked: false, isSelected: false }, 
        { id:  9, isPicked: false, isSelected: false }, { id: 10, isPicked: false, isSelected: false }, { id: 11, isPicked: false, isSelected: false }, { id: 12, isPicked: false, isSelected: false }, 
        { id: 13, isPicked: false, isSelected: false }, { id: 14, isPicked: false, isSelected: false }, { id: 15, isPicked: false, isSelected: false }, { id: 16, isPicked: false, isSelected: false }, 
        { id: 17, isPicked: false, isSelected: false }, { id: 18, isPicked: false, isSelected: false }, { id: 19, isPicked: false, isSelected: false }, { id: 20, isPicked: false, isSelected: false }, 
        { id: 21, isPicked: false, isSelected: false }, { id: 22, isPicked: false, isSelected: false }, { id: 23, isPicked: false, isSelected: false }, { id: 24, isPicked: false, isSelected: false }, 
        { id: 25, isPicked: false, isSelected: false }, { id: 26, isPicked: false, isSelected: false }, { id: 27, isPicked: false, isSelected: false }, { id: 28, isPicked: false, isSelected: false }, 
        { id: 29, isPicked: false, isSelected: false }, { id: 30, isPicked: false, isSelected: false }, { id: 31, isPicked: false, isSelected: false }, { id: 32, isPicked: false, isSelected: false }, 
        { id: 33, isPicked: false, isSelected: false }, { id: 34, isPicked: false, isSelected: false }, { id: 35, isPicked: false, isSelected: false }, { id: 36, isPicked: false, isSelected: false }, 
        { id: 37, isPicked: false, isSelected: false }, { id: 38, isPicked: false, isSelected: false }, { id: 39, isPicked: false, isSelected: false }, { id: 40, isPicked: false, isSelected: false }
    ],
    numberOfPickeds: 0
}


class KenoGameCard extends Component {

    static propTypes = {
        result: PropTypes.number,
        disableControls: PropTypes.bool,
        onResultAnimation: PropTypes.func.isRequired,
        onChangeRollAndRollType: PropTypes.func.isRequired
    };

    static defaultProps = {
        result: null,
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

    onCardClick = index => {
        const { cards } = this.state;
        const isPicked = cards[index].isPicked;

        const total = cards.filter(function(card) {  
            return card.isPicked === true 
        }).length; 

        if (total < maxPickedCards || isPicked) {
            const numberOfPickeds = !isPicked ? total + 1 : total - 1;
            cards[index].isPicked = !isPicked;

            this.setState({
                cards,
                numberOfPickeds
            });
        }

    }

    renderPayouts() {
        const { numberOfPickeds } = this.state;

        if(numberOfPickeds === 0) { return null };

        let payouts = [];

        for (let index = 0; index <= numberOfPickeds; index++) {
            const keno = new Keno({ n: totalOfCards, d: maxPickedCards, x: numberOfPickeds, i: index });
            payouts.push(<div styleName="payout"><Typography variant={'x-small-body'} color={'grey'}>{`${(keno.probability() * 100).toFixed(2)}%`}</Typography></div>);
        }

        return (
            <div styleName={`payouts payouts-${numberOfPickeds}`}>
                {payouts}
            </div>
        )
    }

    renderHits() {
        const { numberOfPickeds } = this.state;

        if(numberOfPickeds === 0) { return null };

        let hits = [];

        for (let index = 0; index <= numberOfPickeds; index++) {
            hits.push(<div styleName="hit"><Typography variant={'x-small-body'} color={'grey'}>{`${index}x`}</Typography> <StarIcon/></div>);
        }

        return (
            <div styleName={`hits hits-${numberOfPickeds}`}>
                {hits}
            </div>
        )

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
                                        <AnimationNumber number={formatPercentage(Numbers.toFloat(item.resultAmount/totalAmount*100))} variant={'small-body'} color={'white'} span={'%'}/>
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
        let { rollType, chance, payout, popularNumbers, cards } = this.state;
        const { result, disableControls, onResultAnimation, rollNumber, bet, animating } = this.props;
        let winEdge = (100-(this.state.edge))/100;
        payout = payout * winEdge;
        const {ln} = this.props;
        const copy = CopyText.diceGameCardIndex[ln];
        return (
        <div styleName="root">
            <div styleName="container">
                {/*this.renderPopularNumbers({popularNumbers})*/}
                <div styleName="board">
                    {cards.map( (card, index) => 
                        {
                            const styles = classNames("cover", {
                                "cover-picked": card.isPicked === true
                            });
                            return(
                                <button styleName="card" onClick={() => this.onCardClick(index)}>
                                    {
                                        card.isSelected === true 
                                        ?
                                            <span styleName="card-selected">
                                                <div styleName="card-star">
                                                    <StarIcon/>
                                                </div>
                                            </span>
                                        :
                                            null
                                    }
                                    <span styleName="card-number">
                                        <Typography variant={'x-small-body'} color={'grey'}>
                                            {card.id} 
                                        </Typography>  
                                    </span>
                                    <div styleName={styles} style={{ opacity : card.isSelected === true ? 0 : 1 }}>
                                        <span styleName="number">
                                            <Typography variant={'body'} color={card.isPicked === true ? 'fixedwhite' : 'white'}>
                                                {card.id} 
                                            </Typography>  
                                        </span>
                                    </div>
                                </button>
                            )
                        }
                    )}
                </div>
                <div styleName="chances">
                    {this.renderPayouts()}
                    {this.renderHits()}
                </div>
                <div styleName="values">
                    <div styleName="values-container">
                    <InputNumber
                        name="payout"
                        min={minPayout}
                        max={maxPayout}
                        precision={4}
                        step={this.getPayoutStep()}
                        title={copy.INDEX.INPUT_NUMBER.TITLE[0]}
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
                        title={copy.INDEX.INPUT_NUMBER.TITLE[1]}
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


function mapStateToProps(state){
    return {
        profile : state.profile,
        ln: state.language
    };
}


export default connect(mapStateToProps)(KenoGameCard);