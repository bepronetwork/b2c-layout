import React, { Component } from "react";
import PropTypes from "prop-types";
import RouletteBoard from "components/RouletteBoard";
import classNames from "classnames";
import { ButtonIcon, Typography } from "components";
import { isEmpty } from "lodash";
import Roulette from "components/Roulette";
import { connect } from "react-redux";
import { find } from "lodash";

import "./index.css";
import { CopyText } from "../../copy";
import { getPopularNumbers } from "../../lib/api/app";
import AnimationNumber from "../AnimationNumber";
import cells from "../RouletteBoard/cells";
import Cache from "../../lib/cache/cache";
import { Numbers } from "../../lib/ethereum/lib";

const mobileBreakpoint = 768;

class RouletteGameCard extends Component {
    redColors = [1, 3, 5, 7, 9, 12, 14, 18, 16, 21, 23, 27, 25, 30, 32, 36, 34];

    static propTypes = {
        result: PropTypes.number,
        onAddChip: PropTypes.func.isRequired,
        betHistory: PropTypes.arrayOf(
        PropTypes.shape({ cell: PropTypes.string, chip: PropTypes.number })
        ).isRequired,
        onClear: PropTypes.func.isRequired,
        onUndo: PropTypes.func.isRequired,
        bet: PropTypes.bool,
        onResultAnimation: PropTypes.func.isRequired,
        isAddChipDisabled: PropTypes.bool.isRequired
    };

    static defaultProps = {
        result: null,
        bet: false
    };

    state = {
        rotating: null
    };

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
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
        if (document.documentElement.clientWidth > mobileBreakpoint && bet){
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
        const { onResultAnimation, bet } = this.props;

        if (rotating !== value) {
        this.setState({ rotating: value }, () => {
            if (
            document.documentElement.clientWidth <= mobileBreakpoint &&
            bet &&
            !value
            ) {
            onResultAnimation();
            }
        });
        }
    };

    renderPopularNumbers = ({popularNumbers}) => {
        if(!popularNumbers){return null}
        const totalAmount = popularNumbers.reduce( (acc, item) => {
            return acc+item.resultAmount;
        }, 0)
        return(
            <div styleName='outer-popular-numbers'>
                <div styleName='inner-popular-numbers'>
                    {popularNumbers.map( item => 
                        {
                            if(!cells[item.key]){return null}
                            let color = cells[item.key].metadata.color;
                            return(
                                <div styleName='popular-number-row'>
                                    <div styleName={`popular-number-container ${color}-square`}>
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

        const {
            result,
            onAddChip,
            betHistory,
            bet,
            isAddChipDisabled
        } = this.props;

        const { rotating, popularNumbers } = this.state;

        const rootStyles = classNames("root", {
        animation: rotating
        });

        const blockStyles = classNames("board-top", {
            block: bet
        });

        return (
        <div styleName={rootStyles}>
            {this.renderResult()}
            {this.renderPopularNumbers({popularNumbers})}
            <div styleName="wheel">
            <Roulette
                bet={bet}
                result={result}
                onAnimation={this.handleRouletteAnimation}
            />
            </div>
            <div styleName="board">
            <div styleName={blockStyles} />
            <RouletteBoard
                ln={this.props.ln}
                onAddChip={onAddChip}
                result={result}
                betHistory={betHistory}
                rotating={rotating}
                isAddChipDisabled={isAddChipDisabled}
            />
            </div>
            {this.renderClearUndo()}
        </div>
        );
    }
}




function mapStateToProps(state){
    return {
        ln : state.language
    };
}

export default connect(mapStateToProps)(RouletteGameCard);
