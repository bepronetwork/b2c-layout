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
