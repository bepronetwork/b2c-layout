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
import tickSound from "assets/keno-tick.mp3";

import "./index.css";
import { KenoBoard } from "..";

const plock = new Audio(plockSound);
const congrats = new Audio(congratsSound); 
const tick = new Audio(tickSound); 

const totalOfCards = 40;
const maxPickedCards = 10;


const defaultState = {
    popularNumbers : [],
    numberOfCardsPicked: 0,
    numberOfDiamonds: 0,
    localCards: []
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
            result: props.result,
            localCards: props.cards
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
        const { onResultAnimation } = this.props;
        const { localCards } = this.state;
        let numberOfDiamonds = 0;

        localCards.forEach( (c) => { c.isSelected = false });
        if(result != null) {
            result.forEach((r, i) => {
                setTimeout(() => {
                    const card = localCards.find( c => {
                        if(c.id === r){
                            return c;
                        }
                    });
                    card.isSelected = true;
                    if (card.isPicked) {
                       this.playSound(congrats, 300);
                       numberOfDiamonds++;
                    }
                    else {
                        this.playSound(plock, 100);
                    }
                    
                    this.setState({
                        result,
                        numberOfDiamonds
                    });
                }, i * 200);
            });

            setTimeout(() => {
                onResultAnimation();
            }, (result.length * 200) + 200);
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
        const { onChooseCards, disableControls, cards } = this.props;
        const localCards = cards;
        const isPicked = localCards[index].isPicked;

        if (disableControls) { return null };

        localCards.map(card => {
            card.isSelected = false;
        });

        const total = localCards.filter(function(card) {  
            return card.isPicked === true 
        }).length; 

        if (total < maxPickedCards || isPicked) {
            const numberOfCardsPicked = !isPicked ? total + 1 : total - 1;
            localCards[index].isPicked = !isPicked;
            this.playSound(tick, 100);

            this.setState({
                numberOfCardsPicked
            });
        }

        this.setState({
            result: null
        });

        onChooseCards(localCards);

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
        const { numberOfCardsPicked } = this.state;
        const { betAmount } = this.props;

        if(numberOfCardsPicked === 0) { return null };

        let payouts = [];

        for (let index = 0; index <= numberOfCardsPicked; index++) {
            const keno = new Keno({ n: totalOfCards, d: maxPickedCards, x: numberOfCardsPicked, i: index });
            const profit = betAmount * 1 / keno.probability();
            payouts.push(<div styleName="payout"><Typography variant={'x-small-body'} color={'grey'}>{`${this.formatPayout(profit.toFixed(2))}`}</Typography></div>);
        }

        return (
            <div styleName={`payouts payouts-${numberOfCardsPicked}`}>
                {payouts}
            </div>
        )
    }

    renderHits() {
        const { numberOfCardsPicked, numberOfDiamonds } = this.state;

        if(numberOfCardsPicked === 0) { return null };

        let hits = [];

        for (let index = 0; index <= numberOfCardsPicked; index++) {
            const styles = classNames("hit", {
                "highlight": index == numberOfDiamonds
            });
            hits.push(<div styleName={styles}><Typography variant={'x-small-body'} color={'grey'}>{`${index}x`}</Typography> <DiamondIcon/></div>);
        }

        return (
            <div styleName={`hits hits-${numberOfCardsPicked}`}>
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

    render() {
        let { payout, popularNumbers, localCards } = this.state;
        const { isWon, winAmount, currency, animating } = this.props;

        let winEdge = (100-(this.state.edge))/100;
        payout = payout * winEdge;

        return (
        <div styleName="root">
            <div styleName="container">
                <KenoBoard cards={localCards} onCardClick={this.onCardClick} />
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