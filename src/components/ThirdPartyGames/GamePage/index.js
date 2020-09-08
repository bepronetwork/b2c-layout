import React, { Component } from "react";
import { Typography } from 'components';
import { connect } from "react-redux";
import _ from 'lodash';
import "./index.css";

class GamePage extends Component {

    constructor(props){
        super(props);
        this.state = {
        };
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {

    }

    render() {
        return (
            <div>
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

export default connect(mapStateToProps)(GamePage);
