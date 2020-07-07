import React, { Component } from "react";
import { connect } from 'react-redux';
import _ from 'lodash';
import "./index.css";


class Live extends Component {

    render() {
        const { streaming } = this.props;

        return (
            <iframe
                src={`${streaming}&parent=${window.location.hostname}`}
                height="350"
                width="100%"
                frameborder="true"
                scrolling="true"
                allowfullscreen="true"
            >
            </iframe>
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