import React, { Component } from "react";
import { Market, ScoreBoard, SideMenu } from 'components';
import { matches } from '../fakeData';
import { connect } from 'react-redux';
import { Live, BetSlip } from "components/Esports";
import _ from 'lodash';
import "./index.css";

class MatchPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            isLive: false
        };
    }

    componentDidMount() {
    }

    render() {
        const { isLive } = this.state;
        const { params } = this.props.match;

        if(!params.id) return null;

        const match = matches.find(m => m.id == params.id)

        return (
            <div styleName="root">
                <div styleName="main">
                    <ScoreBoard match={match} />
                </div>
                <div styleName="painel">
                    <div styleName="left">
                        <SideMenu match={match} />
                    </div>
                    {
                        match.isVideoTransmition
                        ?
                            <div styleName="middle">
                                <Live streaming={match.videoTransmition} />
                            </div>
                        :
                            <Market match={match} />
                    }
                    <div styleName="right">
                       <BetSlip match={match} />
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        profile : state.profile,
        ln: state.language
    };
}

export default connect(mapStateToProps)(MatchPage);