import React, { Component } from "react";
import { Market, ScoreBoard, SideMenu } from 'components';
import { connect } from 'react-redux';
import { Live, BetSlip } from "components/Esports";
import { getMatch } from "controllers/Esports/EsportsUser";
import _ from 'lodash';
import "./index.css";

class MatchPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            match: null
        };
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }


    projectData = async (props) => {
        const { params } = props.match;

        const matchId = parseInt(params.id);
        const match = await getMatch(matchId);

        this.setState({
            match
        })
    }

    render() {
        const { match } = this.state;

        if(!match) return null;

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
                        match.status == "running" && !_.isEmpty(match.live_embed_url)
                        ?
                            <div styleName="middle">
                                <Live streaming={match.live_embed_url} />
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