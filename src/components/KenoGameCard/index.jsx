import React, { Component } from "react";
import PropTypes from "prop-types";
import { Typography, AnimationNumber, StarIcon } from "components";
import { find } from "lodash";
import { connect } from "react-redux";
import classNames from 'classnames';
import { getPopularNumbers } from "../../lib/api/app";
import { Numbers } from "../../lib/ethereum/lib";
import { formatPercentage } from "../../utils/numberFormatation";
import Keno from './keno';

import "./index.css";

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

        if (nextProps.result && nextProps.result !== prevState.result) {
            let history = localStorage.getItem("kenoHistory");

            history = history ? JSON.parse(history) : [];
            history.unshift({ value: nextProps.result, win: true });
            localStorage.setItem("kenoHistory", JSON.stringify(history));
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
        const { betAmount } = this.props;

        if(numberOfPickeds === 0) { return null };

        let payouts = [];

        for (let index = 0; index <= numberOfPickeds; index++) {
            const keno = new Keno({ n: totalOfCards, d: maxPickedCards, x: numberOfPickeds, i: index });
            const profit = betAmount * 1 / keno.probability();
            payouts.push(<div styleName="payout"><Typography variant={'x-small-body'} color={'grey'}>{`${(profit).toFixed(2)}`}</Typography></div>);
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
        let { payout, popularNumbers, cards } = this.state;
        let winEdge = (100-(this.state.edge))/100;
        payout = payout * winEdge;

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