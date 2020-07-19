import React, { Component } from "react";
import { connect } from 'react-redux';
import { Modal } from 'components';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { Market, ScoreBoard, SideMenu, Live, BetSlip, BetSlipFloat, Player } from "components/Esports";
import { getMatch } from "controllers/Esports/EsportsUser";
import { getSkeletonColors } from "../../../lib/helpers";
import _ from 'lodash';
import "./index.css";

class MatchPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            match: null,
            isLoading: true,
            openPlayer: false,
            player: null
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
        let match = null;

        const matchParam = String(params.match);
        if(matchParam != null) {
            const matchId = parseInt(matchParam.split(/[-]+/).pop());
            match = await getMatch(matchId);
        }

        this.setState({
            match,
            isLoading: false
        });
    }

    handlePlayerClick = async (player) => {
        this.setState({ 
            openPlayer: true,
            player
        });
    } 

    handlePlayerModal = async () => {
        const { openPlayer } = this.state;

        this.setState({ openPlayer: !openPlayer });
    } 

    renderPlayerModal = () => {
        const { openPlayer, match, player } = this.state;

        return openPlayer == true ? (
            <Modal onClose={this.handlePlayerModal}>
                <Player 
                    match={match}
                    player={player}
                />
            </Modal>
        ) : null;
    }

    render() {
        const { match, isLoading } = this.state;

        return (
            <div styleName="root">
                {this.renderPlayerModal()}
                <BetSlipFloat />
                <div styleName="main">
                    {isLoading ?
                        <SkeletonTheme color={ getSkeletonColors().color} highlightColor={ getSkeletonColors().highlightColor}>
                            <div style={{opacity : '0.5'}}> 
                                <Skeleton height={70} width={"100%"}/>
                            </div>
                        </SkeletonTheme>
                    :
                        <ScoreBoard match={match} />
                    }
                </div>
                <div styleName="painel">
                    <div styleName="left">
                        {isLoading ?
                            <SkeletonTheme color={ getSkeletonColors().color} highlightColor={ getSkeletonColors().highlightColor}>
                                <div style={{opacity : '0.5'}}> 
                                    <Skeleton height={200} width={"100%"}/>
                                </div>
                            </SkeletonTheme>
                        :
                            <SideMenu match={match} onPlayerClick={this.handlePlayerClick} />
                        }
                    </div>
                    {isLoading ?
                            <SkeletonTheme color={ getSkeletonColors().color} highlightColor={ getSkeletonColors().highlightColor}>
                                <div style={{opacity : '0.5'}}> 
                                    <div styleName="middle">
                                        <Skeleton height={200} width={"100%"}/>
                                    </div>
                                </div>
                            </SkeletonTheme>
                        :
                            match.status == "live" && !_.isEmpty(match.live_embed_url)
                            ?
                                <div styleName="middle">
                                    <Live streaming={match.live_embed_url} />
                                </div>
                            :
                                match.status == "finished" || match.status == "settled"
                                ?
                                    <div/>
                                :
                                    <Market match={match} />  
                    }
                    <div styleName="right">
                        {isLoading ?
                            <SkeletonTheme color={ getSkeletonColors().color} highlightColor={ getSkeletonColors().highlightColor}>
                                <div style={{opacity : '0.5'}}> 
                                    <Skeleton height={100} width={"100%"}/>
                                </div>
                            </SkeletonTheme>
                        :
                            <BetSlip match={match} />
                        }
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