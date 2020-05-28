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
        const { response } = this.props;
        const result = response.outcomeResultSpace.key;
        const game = response.game;
        const value = loadWheelOptions(game);

        this.setState({
            value,
            game,
            result
        });

    }

    handleAnimation = async () => {
    };

    render() {
        const { value, result, game} = this.state;

        if(game === null) { return null };
        //<WheelBox options={value} result={result} game={game}/>
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
