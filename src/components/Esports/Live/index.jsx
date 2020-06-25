import React, { Component } from "react";
import { Typography, Button, LiveIcon } from 'components';
import { connect } from 'react-redux';
import _ from 'lodash';
import "./index.css";


class Live extends Component {

    render() {
        const { streaming } = this.props;

        return (
            <iframe width="100%" height="100%" src={streaming} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        );
    }
}

function mapStateToProps(state){
    return {
        profile : state.profile,
        ln: state.language
    };
}

export default connect(mapStateToProps)(Live);