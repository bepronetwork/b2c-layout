import React, { Component } from "react";
import { Typography } from 'components';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import _ from 'lodash';
import "./index.css";


class ScoreBoard extends Component {

    render() {

        const { match } = this.props;

        return (
            <div styleName="score-board">
                <div styleName="tournament">
                    <Link to="/esports">
                        <div styleName="matches">
                            <Typography variant={'x-small-body'} color={'white'}>&lt; Matches </Typography>
                        </div>
                    </Link>
                    <img src={match.league.image_url} />
                    <div>
                        <div styleName="game-name">
                            <Typography variant={'small-body'} color={'white'}>{match.league.name}</Typography>
                            <span>
                                <Typography variant={'x-small-body'} color={'grey'}>{match.serie.full_name}</Typography>
                            </span>
                        </div>
                    </div>
                </div>
                <div styleName="teams">
                    <div styleName="team">
                        <img src="https://image.flaticon.com/icons/svg/197/197484.svg" />
                        <img src={match.opponents[0].opponent.image_url} />
                        <div>
                            <Typography variant={'small-body'} color={'white'}>{match.opponents[0].opponent.name}</Typography>
                            <span>
                                <Typography variant={'x-small-body'} color={'white'}>{match.results[0].score}</Typography>
                            </span>
                        </div>
                    </div>
                    <div styleName="triangle">
                        <div styleName="right-arrow"></div>
                        <div styleName="vs"><Typography variant={'x-small-body'} color={'grey'}>VS</Typography></div>
                        <div styleName="left-arrow"></div>
                    </div>
                    <div styleName="team">
                        <img src="https://image.flaticon.com/icons/svg/197/197484.svg" />
                        <img src={match.opponents[1].opponent.image_url} />
                        <div>
                            <Typography variant={'small-body'} color={'white'}>{match.opponents[1].opponent.name}</Typography>
                            <span>
                                <Typography variant={'x-small-body'} color={'white'}>{match.results[1].score}</Typography>
                            </span>
                        </div>
                    </div>
                </div>
                <div styleName="date">
                    <Typography variant={'x-small-body'} color={'white'}>in 7 hours, 36 minutes</Typography>
                    <Typography variant={'x-small-body'} color={'white'}>7:00 pm WEST, 8th June</Typography>
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

export default connect(mapStateToProps)(ScoreBoard);