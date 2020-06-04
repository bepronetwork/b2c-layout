import React, { Component } from "react";
import { Typography } from "components";
import { connect } from "react-redux";
import { getAppCustomization } from "../../lib/helpers";
import { Numbers } from "../../lib/ethereum/lib";
import "./index.css";

class WheelBox extends Component {
    constructor(props){
        super(props);
        this.state = {
            options : []
        }
    }

    renderContainer = ({multiplier, index}) => {
        const { result, inResultAnimation, game } = this.props;
        const isLight = getAppCustomization().theme === "light";
        if(!game.resultSpace){return}
        let multiplierResult = null;
        if(result){
            multiplierResult = game.resultSpace[result].multiplier;
        }
        const wasSet = (multiplier == multiplierResult) && !inResultAnimation;
        let styleName = `multiplier-${new String(index).toString().trim()}`;
        styleName += isLight ? ` multiplier-${new String(index).toString().trim()}-light` : '';

        return (
            <div styleName={`box ${styleName} ${wasSet ? 'no-transform' : ''} ${isLight ? 'box-light' : ''}`}>
                <div style={{zIndex : 5}}>
                    <Typography weight="small-body" color="white">
                        {Numbers.toFloat(multiplier)}x
                    </Typography>
                </div>
            </div>
        )
    }
    render() {
        const { options } = this.props;

        return (
            <div styleName="root">
                <div styleName='container-blocks'>
                    {options.map( opt => {
                        return this.renderContainer({multiplier : opt.multiplier, index : opt.index})
                    })}
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

export default connect(mapStateToProps)(WheelBox);
