import React, { Component } from "react";
import { Typography } from "components";
import "./index.css";

class Pegs extends Component {
    render() {
        const { game, result } = this.props;

        return (
            <div styleName={`pegs rows${game.resultSpace.length-1}`}>
                <div styleName="pegs_wrapper" >
                    {game.resultSpace.map((el, i) => {
                        let className;
                        if(el.multiplier < 1){
                            className = 'peg10'
                        }else if(el.multiplier < 2){
                            className = 'peg7'
                        }else{
                            className = 'peg1'
                        };
                        const hasAnimationClass = this.props[`peg${i+1}`] ? 'peg-animated' : '';
                        const resultClass = result ? i === result ? 'result' : 'result-no' : 'result';

                        return (
                            <div styleName={`peg ${className} ${hasAnimationClass} ${resultClass}`} key={`pegs--${el.multiplier}-${i}`}>
                                <Typography variant={'small-body'} color={'fixedwhite'} >{el.multiplier}x</Typography>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}

export default Pegs;