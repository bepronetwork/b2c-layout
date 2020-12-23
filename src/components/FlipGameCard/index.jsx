import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Typography, InputNumber, AnimationNumber } from "components";
import Sound from "react-sound";
import { upperFirst } from "lodash";
import UserContext from "containers/App/UserContext";
import coinSound from "assets/coin-sound.mp3";
import winSound from "assets/win-sound.mp3";
import loseSound from "assets/lose-sound.mp3";
import { find } from 'lodash';
import "./index.css";
import { Numbers } from "../../lib/ethereum/lib";
import { getPopularNumbers } from "../../lib/api/app";
import { formatPercentage } from "../../utils/numberFormatation";
import { CopyText } from '../../copy';
import { connect } from "react-redux";
import letterlogo from 'assets/letter-logo.svg';

const defaultState = {
    payout : 2,
    win_chance : 50,
    isCoinSpinning: false,
    result: null,
    popularNumbers : [],
    edge : 0
}

class FlipGameCard extends Component {
    static contextType = UserContext;

    static propTypes = {
        flipResult: PropTypes.string,
        hasWon: PropTypes.bool,
        onResult: PropTypes.func.isRequired
    };

    static defaultProps = {
        flipResult: null,
        hasWon: null
    };

    constructor(props) {
        super(props);
        this.state = defaultState;
    }

    componentDidMount(){
        this.projectData(this.props);
        setTimeout( () => {
            this.getBets(this.props);
        }, 1*1000)
    }

    UNSAFE_componentWillReceiveProps(props){
        this.projectData(props);
    }


    async getBets(props){
        let res_popularNumbers = await getPopularNumbers({size : 15});
        var gamePopularNumbers = find(res_popularNumbers, { game: props.game._id });
        if(gamePopularNumbers){
            this.setState({
                popularNumbers : gamePopularNumbers.numbers.sort((a, b) => b.resultAmount - a.resultAmount)   
            })    
        }
    }

    async projectData(props){
        let result;

        if (props.flipResult && this.state.result !== props.flipResult) {
            result = props.flipResult;
        }
        if (this.state.result && props.flipResult) {
            result = null;
        }

        this.setState({
            edge : props.game.edge,
            result
        });
    }

    
    renderWinLost = () => {
        const { flipResult, hasWon } = this.props;
        return hasWon
        ? `You won, ${upperFirst(flipResult)}`
        : `You lost, ${upperFirst(flipResult)}`;
    };

    renderCoinSound = () => {
        const { flipResult, isCoinSpinning } = this.props;
        if (!flipResult || !isCoinSpinning) {
            return null;
        }
        return <Sound volume={100} url={coinSound} playStatus="PLAYING" autoLoad />;
    };

    renderWinLoseSound = () => {
        const { flipResult, hasWon, isCoinSpinning } = this.props;

        if (isCoinSpinning || !flipResult) {
            return null;
        }

        return (
            <Sound
                volume={100}
                url={hasWon ? winSound : loseSound}
                playStatus="PLAYING"
                autoLoad
                onFinishedPlaying={this.handleWinLoseFinished}
            />
        );
    };

    handleWinLoseFinished = () => {
        const { onResult } = this.props;
        onResult();
    };

    handleAnimationEnd = () => {
        this.props.handleAnimationEnd();
    };

    handleAnimationStart = () => {
        this.props.handleAnimationStart();
    };

    renderPopularNumbers = ({popularNumbers}) => {
        if(!popularNumbers || (popularNumbers && popularNumbers.length < 1)){return null}
        const totalAmount = popularNumbers.reduce( (acc, item) => {
            return acc+item.resultAmount;
        }, 0)
        return(
            <div styleName='outer-popular-numbers'>
                <div styleName='inner-popular-numbers'>
                    {popularNumbers.map( item => 
                        {
                            if(!item.key){ return null}
                            let color = item.key != 'Head' ? 'blue' : 'red';
                            return(
                                <div styleName='popular-number-row'>
                                    <div styleName={`popular-number-container ${color}-square`}>
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
        const { flipResult } = this.props;
        const { popularNumbers } = this.state;
        const coinStyles = classNames( flipResult ? { [flipResult]: true } : null);
        const coinMainStyles = classNames( "coin-main", flipResult ? { [flipResult]: true } : null);
        let winEdge = (100-(this.state.edge))/100;
        let payout = this.state.payout * winEdge;
        const {ln} = this.props;
        const copy = CopyText.flipGameCardIndex[ln];

        return (
            <div styleName="root">
                {this.renderCoinSound()}
                {this.renderPopularNumbers({popularNumbers})}
                {this.renderWinLoseSound()}
                <div styleName="flip-container">
                    <div styleName={flipResult ? "show-label" : "label"}>
                        <Typography variant="h3" color="white">
                            {flipResult ? this.renderWinLost() : ""}
                        </Typography>
                    </div>
                    <div
                        styleName={coinStyles}
                        onAnimationStart={this.handleAnimationStart}
                        onAnimationEnd={this.handleAnimationEnd}
                    >
                    </div>
                    <div styleName={coinMainStyles}>
                        <div styleName="oval">
                            <div styleName="inner-oval" style={{backgroundImage: "url(" + letterlogo + ")"}}></div>
                        </div>
                        <div styleName="oval-back">
                            <div styleName="inner-oval" style={{backgroundImage: "url(" + letterlogo + ")"}}></div>
                        </div>
                        <div styleName="oval-shadow"></div>
                    </div>
                </div>
                <div styleName="values">
                    <InputNumber
                        name="payout"
                        title={copy.INDEX.INPUT_NUMBER.TITLE[0]}
                        icon="cross"
                        value={Numbers.toFloat(payout)}
                        disabled
                    />

                    <InputNumber
                        name="chance"
                        unit="%"
                        title={copy.INDEX.INPUT_NUMBER.TITLE[1]}
                        disabled
                        value={Numbers.toFloat(this.state.win_chance)}
                    />
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

export default connect(mapStateToProps)(FlipGameCard);