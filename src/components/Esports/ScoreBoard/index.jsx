import React, { Component } from "react";
import { Typography } from 'components';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import ArrowLeft from "components/Icons/ArrowLeft";
import { Opponents, Shield, Status } from 'components/Esports';
import _ from 'lodash';
import "./index.css";

class ScoreBoard extends Component {

    render() {

        const { match } = this.props;
        const images = require.context('assets/esports', true);
        const image = images('./' + match.videogame.slug + '-ico.png');

        return (
            <div styleName="score-board">
                <div styleName="tournament">
                    <Link to="/esports/matches">
                        <div styleName="matches">
                            <ArrowLeft />
                            <Typography variant={'x-small-body'} color={'white'}> Matches </Typography>
                        </div>
                    </Link>
                    <Shield image={image} size={"medium"} isFull={true} />
                    <div styleName="game">
                        <div styleName="game-name">
                            <Typography variant={'small-body'} color={'white'}>{match.league.name}</Typography>
                            <span>
                                <Typography variant={'x-small-body'} color={'grey'}>{match.serie.full_name}</Typography>
                            </span>
                        </div>
                    </div>
                </div>
                <Opponents 
                    isScoreBoard={true} 
                    match={match}
                />
                <Status 
                    status={match.status} 
                    date={match.begin_at} 
                    isMobile={false}
                    hasLiveTransmition={!_.isEmpty(match.live_embed_url)} 
                />
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

export default connect(mapStateToProps)(ScoreBoard);