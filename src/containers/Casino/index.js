import React, { Component } from "react";
import { connect } from 'react-redux';
import HomePage from "./HomePage";

class Casino extends Component {

    constructor(props){
        super(props);
        this.state = {
        };
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async () => {
    }

    render() {
        return (
             <HomePage {...this.props} />
        );
    }
}



function mapStateToProps(state){
    return {
        profile: state.profile,
        ln : state.language
    };
}

export default connect(mapStateToProps)(Casino);

