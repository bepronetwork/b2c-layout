import React, { Component } from "react";
import { connect } from "react-redux";
import Pegs from "../../../../PlinkoGameCard/Components/Pegs";
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

    render() {
        const { result, game } = this.state;

        if(game === null) { return null };

        return (
            <Pegs game={game} result={result} />
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
