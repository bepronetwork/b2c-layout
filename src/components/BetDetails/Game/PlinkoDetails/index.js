import React, { Component } from "react";
import { connect } from "react-redux";
import { Typography } from 'components';
import { loadWheelOptions } from "../../../../lib/helpers";
import _ from 'lodash';
import "./index.css";

class PlinkoDetails extends Component {

    constructor(props){
        super(props);
        this.state = {
            value: 0,
            result: null,
            game: null
        };
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        const { bet } = this.props;
        const result = bet.outcomeResultSpace.key;
        const game = bet.game;

        this.setState({
            game,
            result
        });

    }

    handleAnimation = async () => {
    };

    render() {
        const { result, game } = this.state;

        if(game === null) { return null };

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
                        const resultClass = i == result ? 'result' : '';

                        return (
                            <div styleName={`peg ${className} ${resultClass}`} >
                                <Typography variant={'small-body'} color={'pickled-bluewood'} >{el.multiplier}x</Typography>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile,
        ln : state.language
    };
}

export default connect(mapStateToProps)(PlinkoDetails);
