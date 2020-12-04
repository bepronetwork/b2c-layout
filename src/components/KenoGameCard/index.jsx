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
import { CopyText } from '../../copy';
import Keno from './keno';
import _ from 'lodash';
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
    localCards: [],
    showChance: false,
    chanceProfit: null,
    chancePayout: null,
    chanceWinChance: null
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
        if (!_.isEmpty(result)) {
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
        const { onChooseCards, animating, cards } = this.props;
        const localCards = cards;
        const isPicked = localCards[index].isPicked;

        if (animating) { return null };

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
            return amount.substring(0, 3);
        }

        return amount;
    }

    renderPayouts() {
        const { numberOfCardsPicked } = this.state;
        const { betAmount } = this.props;

        if(numberOfCardsPicked === 0) { return null };

        let payouts = [];

        for (let index = 0; index <= numberOfCardsPicked; index++) {
            const keno = new Keno({ n: totalOfCards, d: maxPickedCards, x: numberOfCardsPicked, y: index });
            const probability = this.getGameProbablityNormalizer(keno.probability(), numberOfCardsPicked, index);
            let profit = 0;
            let payout = 0;

            if(probability !== 0) {
                profit = betAmount * 1 / probability;
                if(betAmount > 0) { payout = profit / betAmount; };
            }

            payouts.push(<div styleName="payout"><Typography variant={'x-small-body'} color={'grey'}>{`${this.formatPayout(payout.toFixed(2))}x`}</Typography></div>);
        }

        return (
            <div styleName={`payouts payouts-${numberOfCardsPicked}`}>
                {payouts}
            </div>
        )
    }

    handleChances(index) {
        const { numberOfCardsPicked } = this.state;
        const { betAmount } = this.props;

        const keno = new Keno({ n: totalOfCards, d: maxPickedCards, x: numberOfCardsPicked, y: index });
        let probability = this.getGameProbablityNormalizer(keno.probability(), numberOfCardsPicked, index);
        let profit = 0;
        let payout = 0;

        if(probability !== 0) {
            profit = betAmount * 1 / probability;
            if(betAmount > 0) { payout = profit / betAmount; };
        }

        this.setState({
            showChance: true,
            chanceProfit: formatCurrency(profit),
            chancePayout: this.formatPayout(payout.toFixed(2)),
            chanceWinChance: (keno.probability() * 100).toFixed(8)
        })
    }

    getGameProbablityNormalizer(probability, x, y){
        let ret = probability;
        if(x == 1){
            if(y == 0){ ret = 2.5; }
            if(y == 1){ ret = 0.36363636363; }
        }else if( x == 2){
            if(y == 0){ ret = 0; }
            if(y == 1){ ret = 0.55555555555; }
            if(y == 2){ ret = 0.19607843137; }
        }else if( x == 3){
            if(y == 0){ ret = 0; }
            if(y == 1){ ret = 0; }
            if(y == 2){ ret = 0.35714285714; }
            if(y == 3){ ret = 0.02; }
        }else if( x == 4){
            if(y == 0){ ret = 0; }
            if(y == 1){ ret = 0; }
            if(y == 2){ ret = 1/1.7; }
            if(y == 3){ ret = 1/10; }
            if(y == 4){ ret = 1/100; }
        }else if( x == 5){
            if(y == 0){ ret = 0; }
            if(y == 1){ ret = 0; }
            if(y == 2){ ret = 1/1.4; }
            if(y == 3){ ret = 1/4; }
            if(y == 4){ ret = 1/14; }
            if(y == 5){ ret = 1/390; }
        }else if( x == 6){
            if(y == 0){ ret = 0; }
            if(y == 1){ ret = 0; }
            if(y == 2){ ret = 0; }
            if(y == 3){ ret = 1/3; }
            if(y == 4){ ret = 1/9; }
            if(y == 5){ ret = 1/180; }
            if(y == 6){ ret = 1/710; }
        }else if( x == 7){
            if(y == 0){ ret = 0; }
            if(y == 1){ ret = 0; }
            if(y == 2){ ret = 0; }
            if(y == 3){ ret = 1/2; }
            if(y == 4){ ret = 1/7; }
            if(y == 5){ ret = 1/30; }
            if(y == 6){ ret = 1/400; }
            if(y == 7){ ret = 1/800; }
        }else if( x == 8){
            if(y == 0){ ret = 0; }
            if(y == 1){ ret = 0; }
            if(y == 2){ ret = 0; }
            if(y == 3){ ret = 1/2; }
            if(y == 4){ ret = 1/4; }
            if(y == 5){ ret = 1/11; }
            if(y == 6){ ret = 1/67; }
            if(y == 7){ ret = 1/400; }
            if(y == 8){ ret = 1/900; }
        }else if( x == 9){
            if(y == 0){ ret = 0; }
            if(y == 1){ ret = 0; }
            if(y == 2){ ret = 0; }
            if(y == 3){ ret = 1/2; }
            if(y == 4){ ret = 1/2.5; }
            if(y == 5){ ret = 1/5; }
            if(y == 6){ ret = 1/15; }
            if(y == 7){ ret = 1/100; }
            if(y == 8){ ret = 1/500; }
            if(y == 9){ ret = 1/1000; }
        }else if( x == 10){
            if(y == 0){ ret = 0; }
            if(y == 1){ ret = 0; }
            if(y == 2){ ret = 0; }
            if(y == 3){ ret = 1/1.6; }
            if(y == 4){ ret = 1/2; }
            if(y == 5){ ret = 1/4; }
            if(y == 6){ ret = 1/7; }
            if(y == 7){ ret = 1/26; }
            if(y == 8){ ret = 1/100; }
            if(y == 9){ ret = 1/500; }
            if(y == 10){ ret = 1/1000; }
        }
        return ret;
    }

    handleMouseOut() {
        this.setState({
            showChance: false
        })
    }

    renderHits() {
        const { numberOfCardsPicked, numberOfDiamonds, showChance, chanceProfit, chancePayout, chanceWinChance } = this.state;
        const { ln, currency } = this.props;
        const copy = CopyText.kenoGameCardIndex[ln];

        if(numberOfCardsPicked === 0) { return null };

        let hits = [];

        for (let index = 0; index <= numberOfCardsPicked; index++) {
            const styles = classNames("hit", {
                "highlight": index == numberOfDiamonds
            });
            hits.push(<div styleName={styles} onMouseOver={() => this.handleChances(index)} onMouseOut={() => this.handleMouseOut()}><Typography variant={'x-small-body'} color={'grey'}>{`${index}x`}</Typography> <DiamondIcon/></div>);
        }

        return (
            <div>
                <div styleName={`hits hits-${numberOfCardsPicked}`}>
                    {hits}
                </div>
                {
                    showChance == true  
                    ?
                        <div styleName="show-chance">
                            <div>
                                <div styleName='label'>
                                    <Typography variant={'x-small-body'} color={`casper`} weight={`bold`}>
                                        {copy.INDEX.INPUT_NUMBER.TITLE[0]}
                                    </Typography>
                                </div>
                                <div styleName='text'>
                                    <Typography variant={'x-small-body'} color={`white`}>
                                        {chancePayout}x
                                    </Typography>
                                </div>
                            </div>
                            <div>
                                <div styleName='label'>
                                    <Typography variant={'x-small-body'} color={`casper`} weight={`bold`}>
                                        {copy.INDEX.INPUT_NUMBER.TITLE[2]}
                                    </Typography>
                                </div>
                                <div styleName='text currency'>
                                    <Typography variant={'x-small-body'} color={`white`}>
                                        {chanceProfit}
                                    </Typography>
                                    <img src={currency.image} width={14} height={14}/>
                                </div>
                            </div>
                            <div>
                                <div styleName='label'>
                                    <Typography variant={'x-small-body'} color={`casper`} weight={`bold`}>
                                        {copy.INDEX.INPUT_NUMBER.TITLE[1]}
                                    </Typography>
                                </div>
                                <div styleName='text'>
                                    <Typography variant={'x-small-body'} color={`white`}>
                                        {chanceWinChance}%
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    :
                        null
                }
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
        let { popularNumbers, localCards, numberOfCardsPicked, numberOfDiamonds } = this.state;
        const { isWon, winAmount, currency, animating, betAmount } = this.props;

        const keno = new Keno({ n: totalOfCards, d: maxPickedCards, x: numberOfCardsPicked, y: numberOfDiamonds });
        let probability = this.getGameProbablityNormalizer(keno.probability(), numberOfCardsPicked, numberOfDiamonds);
        const payout = betAmount * 1 / probability / betAmount; 

        return (
        <div styleName="root">
            <div styleName="container">
                <KenoBoard cards={localCards} onCardClick={this.onCardClick} />
                {
                    isWon === true && animating === false && winAmount > betAmount
                    ?
                        <div styleName="won">
                            <div styleName="won-1">
                                <Typography variant={'body'} color={'white'} weight={"bold"}>
                                    {payout.toFixed(2)}x
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