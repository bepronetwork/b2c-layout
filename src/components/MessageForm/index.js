import React, { Component } from "react";
import Message from './Message';

import "./index.css";

export default class MessageForm extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    handleTabChange = name => {
        this.setState({ tab: name });
    };

    render() {
        return (
                <Message {...this.props} />
            );
        }
    }
