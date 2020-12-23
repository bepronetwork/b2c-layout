import React, { Component } from "react";
import { connect } from "react-redux";
import Pegs from "../../../../PlinkoGameCard/Components/Pegs";
import "./index.css";


class PlinkoDetails extends Component {

    constructor(props){
        super(props);
        this.state = {
            result: null,
            game: null
        };
    }

    componentDidMount(){
        this.projectData();
    }

    UNSAFE_componentWillReceiveProps(){
        this.projectData();
    }

    projectData = async () => {
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
