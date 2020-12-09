import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { ButtonIcon, Typography } from "components";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import { find } from "lodash";
import { getAppCustomization } from "../../lib/helpers";
import { CopyText } from "../../copy";
import { getPopularNumbers } from "../../lib/api/app";
import AnimationNumber from "../AnimationNumber";
import Wheel from "../Wheel";
import WheelBox from "../WheelBox";
import { Numbers } from "../../lib/ethereum/lib";
import { formatPercentage } from "../../utils/numberFormatation";
import "./index.css";

class WheelGameCard extends Component {
    redColors = [1, 3, 5, 7, 9, 12, 14, 18, 16, 21, 23, 27, 25, 30, 32, 36, 34];

    static propTypes = {
        result: PropTypes.number,
        betHistory: PropTypes.arrayOf(
        PropTypes.shape({ cell: PropTypes.string, chip: PropTypes.number })
        ).isRequired,
        onClear: PropTypes.func.isRequired,
        onUndo: PropTypes.func.isRequired,
        bet: PropTypes.bool,
        onResultAnimation: PropTypes.func.isRequired,
    };

    static defaultProps = {
        result: null,
        bet: false
    };

    state = {
        rotating: null,
    };

    componentDidMount(){
        this.projectData(this.props);
    }

    projectData = async (props) => {
        const { bet } = props;

        if(bet == false){
            this.setPopularNumbers(props);
        }
    }

    setPopularNumbers = async (props) => {
        let popularNumbers = await getPopularNumbers({size : 15});
        var gamePopularNumbers = find(popularNumbers, { game: props.game._id });
        if(gamePopularNumbers){
            this.setState({...this.state,
                popularNumbers : gamePopularNumbers.numbers.sort((a, b) => b.resultAmount - a.resultAmount )   
            })    
        }
    }
    
    handleAnimationEnd = () => {
        const { onResultAnimation, bet } = this.props;
        if (bet){
            onResultAnimation();
        }
    };


    renderResult = () => {
        const { result } = this.props;
        const { rotating } = this.state;

        const resultStyles = classNames("result", {
        green: result === 0 && !rotating,
        red: this.redColors.includes(result) && !rotating,
        picked:
            result && result !== 0 && !this.redColors.includes(result) && !rotating
        });
        
        return (
            <div styleName="result-container">
                <div styleName={resultStyles} onTransitionEnd={this.handleAnimationEnd}>
                <h4>{result}</h4>
                </div>
            </div>
        );
    };

    renderClearUndo = () => {
        const { onClear, onUndo, betHistory, ln } = this.props;
        const { rotating } = this.state;
        const copy = CopyText.shared[ln];

        const disabled = !betHistory || isEmpty(betHistory) || rotating;

        return (
            <div styleName="chip-controls">
                <ButtonIcon
                icon="undo"
                label={copy.UNDO_NAME}
                iconAtLeft
                onClick={onUndo}
                disabled={disabled}
                />

                <ButtonIcon
                icon="rotate"
                label={copy.CLEAR_NAME}
                onClick={onClear}
                disabled={disabled}
                />
            </div>
        );
    };

    handleRouletteAnimation = value => {
        const { rotating } = this.state;

        if (rotating !== value) {
            this.setState({ rotating: value })
        }
    };

    renderPopularNumbers = ({popularNumbers}) => {
        const { options } = this.props;
        const isLight = getAppCustomization().theme === "light";
        
        if(!popularNumbers){return null}

        const totalAmount = popularNumbers.reduce( (acc, item) => {
            return acc+item.resultAmount;
        }, 0);
        let popularSpaces = options.map( opt => {
            let resultAmount = popularNumbers.reduce( (acc, item) => {
                if(opt.placings.find( placing => placing == item.key)){
                    return acc+item.resultAmount;
                }else{
                    return acc;
                }
            }, 0);
            return {
                resultAmount,
                multiplier : opt.multiplier,
                index : opt.index
            }
        }).filter(el => el != null).sort((a, b) => b.resultAmount - a.resultAmount ) ;
        return(
            <div styleName='outer-popular-numbers'>
                <div styleName='inner-popular-numbers'>
                    {popularSpaces.map( item => 
                        {
                            return(
                                <div styleName='popular-number-row'>
                                    <div styleName={`popular-number-container multiplier-${new String(parseInt(item.index))} ${isLight ? ` multiplier-${new String(parseInt(item.index))}-light` : ''}`}>
                                        <Typography variant={'small-body'} color={'fixedwhite'}>
                                            {item.multiplier}
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

        const {
            result,
            bet,
            game,
            inResultAnimation, 
            colors, 
            options 
        } = this.props;

        const { rotating, popularNumbers} = this.state;
        const rootStyles = classNames("root", {
        animation: rotating
        });

        return (
        <div styleName={rootStyles}>
            {this.renderPopularNumbers({popularNumbers})}
            <div styleName="wheel">
                <Wheel
                    bet={bet}
                    colors={colors}
                    inResultAnimation={inResultAnimation}
                    result={result}
                    game={game}
                    options={options}
                    rotating={rotating}
                    stopAnimation={this.handleAnimationEnd}
                    onAnimation={this.handleRouletteAnimation}
                />
            </div>
            <div styleName="board">
                <WheelBox options={options} game={this.props.game} result={result} inResultAnimation={inResultAnimation} game={game}/>
            </div>
        </div>
        );
    }
}




function mapStateToProps(state){
    return {
        ln : state.language
    };
}

export default connect(mapStateToProps)(WheelGameCard);
