import React, { Component } from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import _ from 'lodash';

import "./index.css";
class IFrame extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.max !== this.props.max
    }

    render() {
        const { providerUrl, token, partnerId, playerId, gameId, ln, ticker, max } = this.props;
        const thirdStyles = classNames("iframe", {
            max: max === true
        });

        return (
            <iframe key={gameId} styleName={thirdStyles} allowFullScreen="" 
                src={`${providerUrl}/game?token=${token}&partner_id=${partnerId}&player_id=${playerId}&game_id=${gameId}&language=${ln}&currency=${ticker}`}
                frameBorder="0">
            </iframe>
        );
    }
}

function mapStateToProps(state){
    return {
        profile : state.profile,
        ln : state.language
    };
}

export default connect(mapStateToProps)(IFrame);
