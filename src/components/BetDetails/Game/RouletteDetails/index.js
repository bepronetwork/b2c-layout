import React, { Component } from "react";
import { connect } from "react-redux";
import RouletteBoard from "components/RouletteBoard";
import _ from 'lodash';
import "./index.css";

class RouletteDetails extends Component {

    constructor(props){
        super(props);
        this.state = {
            betHistory: []
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

        const result = response.result;
        const betHistory = result.map( el => {
            return { cell : el._id.place, chip : el._id.value.toFixed(3) }
        })

        this.setState({
            betHistory
        });
    }

    render() {
        const { betHistory } = this.state;

        return (
            <RouletteBoard
                betHistory={betHistory}
                rotating={false}
                isAddChipDisabled={true}
            />
        );
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile,
        ln : state.language
    };
}

export default connect(mapStateToProps)(RouletteDetails);
