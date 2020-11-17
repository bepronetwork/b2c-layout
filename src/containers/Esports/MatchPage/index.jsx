import React, { Component } from "react";
import { connect } from 'react-redux';
import { Modal } from 'components';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { Market, ScoreBoard, SideMenu, Live, BetSlip, BetSlipFloat, Player, OddsTable } from "components/Esports";
import { getMatch } from "controllers/Esports/EsportsUser";
import { getSkeletonColors } from "../../../lib/helpers";
import _ from 'lodash';
import "./index.css";

import socketConnection from '../WebSocket'
import store from "../../App/store";
import { setBetSlipResult } from "../../../redux/actions/betSlip";

class MatchPage extends Component {
    static contextType = socketConnection;

    constructor(props){
        super(props);
        this.state = {
            match: null,
            isLoading: true,
            openPlayer: false,
            player: null,
            isLive: false
        };
    }

    componentDidMount(){
        this.projectData(this.props)
        this.createSocketConnection(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    createSocketConnection = () => {
        const { connection } = this.context;

        if (connection) {
            connection.on("matchUpdate", this.updateMatch);
        }
    }

    updateMatch = async (data) => {
        const { match } = this.state;

        if (match && match.id === data.message) {
            const matchUpdated = await getMatch(data.message);

            if (matchUpdated && !_.isEmpty(matchUpdated.odds)) {
                const isLive = matchUpdated.status == "live";
    
                this.setState({
                    match: matchUpdated,
                    isLoading: false,
                    isLive
                });

                this.updateBetSlip(matchUpdated, data.message);
            }
        }
    }

    updateBetSlip = (match, id) => {
        const state = store.getState();
        const { betSlip } = state;

        const ids = betSlip && _.isArray(betSlip) ? betSlip.map(bet => bet.externalMatchId) : [];

        if (ids.includes(id)) {
            let newBetSlip = [...betSlip];

            const betSlipArr = newBetSlip.map(bet => {
                if (bet.externalMatchId === match.id && !_.isEmpty(match.odds)) {

                    const opponent = match.odds[bet.type].find(opponent => opponent.participant_id === bet.id);
                    const marketActive = match.market ? match.market.status === 'active' : false;

                    let status;

                    if (parseFloat(opponent.odd) === parseFloat(bet.odd)) {
                        status = 'stable'
                    } else if (parseFloat(opponent.odd) < parseFloat(bet.odd)) {
                        status = 'down'
                    } else {
                        status = 'up'
                    }

                    return {...bet, odd: opponent.odd, status: status, marketActive: marketActive }
                } else {
                    return bet
                }
            })

            store.dispatch(setBetSlipResult(betSlipArr))
        }
    }

    projectData = async (props) => {
        const { params } = props.match;
        let match = null;

        const matchParam = String(params.match);
        if(matchParam != null) {
            const matchId = parseInt(matchParam.split(/[-]+/).pop());
            match = await getMatch(matchId);
        }

        const isLive = match.status == "live";

        this.setState({
            match,
            isLoading: false,
            isLive
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
        const { onHandleLoginOrRegister } = this.props;
        const { match, isLoading, isLive } = this.state;

        return (
            <div styleName="root">
                {this.renderPlayerModal()}
                <BetSlipFloat onHandleLoginOrRegister={onHandleLoginOrRegister}/>
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
                            isLive == true && match.live_embed_url !== null
                            ?
                                <div styleName={isLive == true ? "isLive middle" : "middle"}>
                                    <Live streaming={match.live_embed_url} match={match} />
                                </div>
                            :
                                match.status == "finished" || match.status == "settled"
                                ?
                                    <div/>
                                :
                                    <div>
                                        <Market match={match} />
                                    </div>
                    }
                    <div styleName="right">
                        {isLoading ?
                            <SkeletonTheme color={ getSkeletonColors().color} highlightColor={ getSkeletonColors().highlightColor}>
                                <div style={{opacity : '0.5'}}> 
                                    <Skeleton height={100} width={"100%"}/>
                                </div>
                            </SkeletonTheme>
                        :
                            <BetSlip match={match} onHandleLoginOrRegister={onHandleLoginOrRegister}/>
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