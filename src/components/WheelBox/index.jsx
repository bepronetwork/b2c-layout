import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Typography,
} from "components";
import { connect } from "react-redux";
import "./index.css";
import { CopyText } from "../../copy";
import { Numbers } from "../../lib/ethereum/lib";

class WheelBox extends Component {
    constructor(props){
        super(props);
        this.state = {
            options : []
        }
    }

    renderContainer = ({multiplier, index}) => {
        const { result, inResultAnimation, game } = this.props;
        if(!game.resultSpace){return}
        let multiplierResult = null;
        if(result){
            multiplierResult = game.resultSpace[result].multiplier;
        }
        const wasSet = (multiplier == multiplierResult) && !inResultAnimation;
        let styleName = `multiplier-${new String(index).toString().trim()}`;

        return (
            <div styleName={`box ${styleName} ${wasSet ? 'no-transform' : ''}`}>
                <div style={{zIndex : 10}}>
                    <Typography weight="small-body" color="white">
                        {Numbers.toFloat(multiplier)}x
                    </Typography>
                </div>
            </div>
        )
    }
    render() {
        const { ln, options } = this.props;
        const copy = CopyText.shared[ln];

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
