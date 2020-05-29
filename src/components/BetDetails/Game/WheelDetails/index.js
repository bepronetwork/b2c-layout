import React, { Component } from "react";
import { connect } from "react-redux";
import WheelBox from "../../../WheelBox";
import { loadWheelOptions } from "../../../../lib/helpers";
import _ from 'lodash';
import "./index.css";

class WheelDetails extends Component {

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
        const value = loadWheelOptions(game);

        this.setState({
            value,
            game,
            result
        });

    }

    render() {
        const { value, result, game } = this.state;

        if(game === null) { return null };

        return (
            <WheelBox options={value} result={result} game={game}/>
        );
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile,
        ln : state.language
    };
}

export default connect(mapStateToProps)(WheelDetails);
