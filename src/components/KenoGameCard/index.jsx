import React, { Component } from "react";
import PropTypes from "prop-types";
import { Typography, AnimationNumber, StarIcon, DiamondIcon } from "components";
import { find } from "lodash";
import { connect } from "react-redux";
import classNames from 'classnames';
import { getPopularNumbers } from "../../lib/api/app";
import { Numbers } from "../../lib/ethereum/lib";
import { formatPercentage } from "../../utils/numberFormatation";
import { formatCurrency } from "../../utils/numberFormatation";
import Keno from './keno';
import plockSound from "assets/keno-selected.mp3";
import congratsSound from "assets/keno-diamond.mp3";

import "./index.css";

const plock = new Audio(plockSound);
const congrats = new Audio(congratsSound);
const totalOfCards = 40;
const maxPickedCards = 10;


const defaultState = {
    popularNumbers : [],
    cards: [ 
        { id: 0,  display:  1, isPicked: false, isSelected: false }, { id: 1,  display:  2, isPicked: false, isSelected: false }, { id: 2,  display:  3, isPicked: false, isSelected: false }, { id: 3,  display:  4, isPicked: false, isSelected: false }, 
        { id: 4,  display:  5, isPicked: false, isSelected: false }, { id: 5,  display:  6, isPicked: false, isSelected: false }, { id: 6,  display:  7, isPicked: false, isSelected: false }, { id: 7,  display:  8, isPicked: false, isSelected: false }, 
        { id: 8,  display:  9, isPicked: false, isSelected: false }, { id: 9,  display: 10, isPicked: false, isSelected: false }, { id: 10, display: 11, isPicked: false, isSelected: false }, { id: 11, display: 12, isPicked: false, isSelected: false }, 
        { id: 12, display: 13, isPicked: false, isSelected: false }, { id: 13, display: 14, isPicked: false, isSelected: false }, { id: 14, display: 15, isPicked: false, isSelected: false }, { id: 15, display: 16, isPicked: false, isSelected: false }, 
        { id: 16, display: 17, isPicked: false, isSelected: false }, { id: 17, display: 18, isPicked: false, isSelected: false }, { id: 18, display: 19, isPicked: false, isSelected: false }, { id: 19, display: 20, isPicked: false, isSelected: false }, 
        { id: 20, display: 21, isPicked: false, isSelected: false }, { id: 21, display: 22, isPicked: false, isSelected: false }, { id: 22, display: 23, isPicked: false, isSelected: false }, { id: 23, display: 24, isPicked: false, isSelected: false }, 
        { id: 24, display: 25, isPicked: false, isSelected: false }, { id: 25, display: 26, isPicked: false, isSelected: false }, { id: 26, display: 27, isPicked: false, isSelected: false }, { id: 27, display: 28, isPicked: false, isSelected: false }, 
        { id: 28, display: 29, isPicked: false, isSelected: false }, { id: 29, display: 30, isPicked: false, isSelected: false }, { id: 30, display: 31, isPicked: false, isSelected: false }, { id: 31, display: 32, isPicked: false, isSelected: false }, 
        { id: 32, display: 33, isPicked: false, isSelected: false }, { id: 33, display: 34, isPicked: false, isSelected: false }, { id: 34, display: 35, isPicked: false, isSelected: false }, { id: 35, display: 36, isPicked: false, isSelected: false }, 
        { id: 36, display: 37, isPicked: false, isSelected: false }, { id: 37, display: 38, isPicked: false, isSelected: false }, { id: 38, display: 39, isPicked: false, isSelected: false }, { id: 39, display: 40, isPicked: false, isSelected: false }
    ],
    numberOfPickeds: 0
}

class KenoGameCard extends Component {

    static propTypes = {
        result: PropTypes.array,
        disableControls: PropTypes.bool,
        onResultAnimation: PropTypes.func.isRequired
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

    async componentWillReceiveProps(props){
        await this.projectData(props);

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

    async projectData(props){
        let result = null;

        if (props.result && this.state.result !== props.result) {
            result = props.result;
            this.renderResult(result);
        }
        if (this.state.result && props.result) {
            result = null;
        }

        this.setState({...this.state, 
            edge : props.game.edge,
            result
        });
    }

    async renderResult(result) {
        const { cards } = this.state;
        const { onResultAnimation } = this.props;

        cards.forEach( (c) => { c.isSelected = false });
        if(result != null) {
            result.forEach((r, i) => {
                setTimeout(() => {
                    const card = cards.find( c => {
                        if(c.id === r){
                            return c;
                        }
                    });
                    card.isSelected = true;
                    card.isPicked ? this.playSound(congrats, 300) : this.playSound(plock, 100);
                    this.setState({
                        cards
                    });
                }, i * 200);
            });

            setTimeout(() => {
                onResultAnimation();
            }, (result.length * 200) + 400);
        }

    }

    playSound = (sound, timeout) => {
        const soundConfig = localStorage.getItem("sound");

        if (soundConfig !== "on") {
            return null;
        }

        sound.play();
        setTimeout(() => {
            sound.pause();
            sound.currentTime = 0;
        }, timeout);
    };

    onCardClick = index => {
        const { onChooseCards, disableControls } = this.props;
        const { cards } = this.state;
        const isPicked = cards[index].isPicked;

        if (disableControls) { return null };

        cards.map(card => {
            card.isSelected = false;
        });

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

        this.setState({
            cards,
            result: null
        });

        onChooseCards(cards.filter(function(card) {  
            return card.isPicked === true 
        }));

    }

    formatPayout(amount) {
        const arr = amount.split('.');
        const first = arr[0];
        const second = arr[1];

        if(first == 0 && second == 0) {
            return 0;
        }
        else if((first > 0 && second == 0) || first > 9) {
            return first;
        }
        else if(first > 0 && first < 10 && second > 0) {
            return amount.substring(0, 1);
        }

        return amount;
    }

    renderPayouts() {
        const { numberOfPickeds } = this.state;
        const { betAmount } = this.props;

        if(numberOfPickeds === 0) { return null };

        let payouts = [];

        for (let index = 0; index <= numberOfPickeds; index++) {
            const keno = new Keno({ n: totalOfCards, d: maxPickedCards, x: numberOfPickeds, i: index });
            const profit = betAmount * 1 / keno.probability();
            payouts.push(<div styleName="payout"><Typography variant={'x-small-body'} color={'grey'}>{`${this.formatPayout(profit.toFixed(2))}`}</Typography></div>);
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
            hits.push(<div styleName="hit"><Typography variant={'x-small-body'} color={'grey'}>{`${index}x`}</Typography> <DiamondIcon/></div>);
        }

        return (
            <div styleName={`hits hits-${numberOfPickeds}`}>
                {hits}
            </div>
        )

    }

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

    renderBoard = (card, index) => {
        const styles = classNames("cover", {
            "cover-picked": card.isPicked === true,
            "cover-selected": card.isSelected === true && card.isPicked === false
        });
        return(
            <button styleName="card" onClick={() => this.onCardClick(index)} style={{outline: "none"}}>
                {
                    card.isSelected === true && card.isPicked === true
                    ?
                        <span styleName="card-selected">
                            <div styleName="card-star">
                                <DiamondIcon/>
                            </div>
                        </span>
                    :
                        null
                }
                <span styleName="card-number">
                    <Typography variant={'body'} color={'white'} weight={"bold"}>
                        {card.display} 
                    </Typography>  
                </span>
                <div styleName={styles} style={{ opacity : card.isSelected === true && card.isPicked === true ? 0 : 1 }}>
                    <span styleName="number">
                        <Typography variant={'body'} color={card.isPicked === true ? 'fixedwhite' : 'white'} weight={"bold"}>
                            {card.display} 
                        </Typography>  
                    </span>
                </div>
            </button>
        )

    }

    render() {
        let { payout, popularNumbers, cards } = this.state;
        const { isWon, winAmount, currency, animating } = this.props;

        let winEdge = (100-(this.state.edge))/100;
        payout = payout * winEdge;

        return (
        <div styleName="root">
            <div styleName="container">
                <div styleName="board">
                    {cards.map( (card, index) => 
                        this.renderBoard(card, index)
                    )}
                </div>
                {
                    isWon === true && animating === false
                    ?
                        <div styleName="won">
                            <div styleName="won-1">
                                <Typography variant={'small-body'} color={'white'} weight={"bold"}>
                                    Win
                                </Typography> 
                                <div styleName="currency">
                                    <Typography variant={'small-body'} color={'white'} weight={"bold"}>
                                        {formatCurrency(winAmount)}
                                    </Typography> 
                                    <img src={currency.image} width={16} height={16}/>
                                </div>
                            </div>
                        </div>
                    :
                        null
                }
                <div styleName="chances">
                    {this.renderPayouts()}
                    {this.renderHits()}
                </div>
            </div>
        </div>
        );
    }
}


function mapStateToProps(state){
    return {
        profile : state.profile,
        ln: state.language,
        currency: state.currency
    };
}


export default connect(mapStateToProps)(KenoGameCard);