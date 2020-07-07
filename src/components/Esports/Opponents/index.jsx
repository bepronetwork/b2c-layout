import React, { Component } from "react";
import { Typography } from 'components';
import { Shield } from "components/Esports";
import classNames from 'classnames';
import ReactCountryFlag from "react-country-flag"
import _ from 'lodash';
import "./index.css";


export default class Opponents extends Component {

    constructor(props) {
        super(props);
        this.state = {
            opponent1: {
                location: null,
                image: null,
                name: "Team 1",
                score: 0,
                odd: null
            },
            opponent2: {
                location: null,
                image: null,
                name: "Team 2",
                score: 0,
                odd: null
            },
            drawOdd: null,
            isScoreBoard: false
        };
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        const { opponents, results, odds, gameImage, isScoreBoard } = props;
        let { opponent1, opponent2, drawOdd } = this.state;

        if(_.isEmpty(opponents)) {
            opponent1.image = gameImage;
            opponent2.image = gameImage;
        }
        else {
            opponent1.image = opponents[0].opponent.image_url;
            opponent1.name  = opponents[0].opponent.name;
            opponent1.location  = opponents[0].opponent.location;
            opponent1.score = results.find(r => r.team_id == opponents[0].opponent.id).score;
            const oddType = odds.winnerTwoWay.length > 0 ? odds.winnerTwoWay : odds.winnerThreeWay;
            drawOdd = odds.winnerThreeWay.length > 0 ? (oddType.find(o => o.participant_id == null).probability).toFixed(2) : null;

            if(odds != null) {
                opponent1.odd = oddType.find(o => o.participant_id == opponents[0].opponent.id);
                opponent1.odd = !_.isEmpty(opponent1.odd) ? (1 / opponent1.odd.probability).toFixed(2) : null;
            }

            opponent2.image = opponents[1].opponent.image_url;
            opponent2.name  = opponents[1].opponent.name;
            opponent2.location  = opponents[0].opponent.location;
            opponent2.score = results.find(r => r.team_id == opponents[1].opponent.id).score;

            if(odds != null) {
                opponent2.odd = oddType.find(o => o.participant_id == opponents[1].opponent.id);
                opponent2.odd = !_.isEmpty(opponent2.odd) ? (1 / opponent2.odd.probability).toFixed(2) : null;
            }
        }

        this.setState({
            opponent1,
            opponent2,
            drawOdd,
            isScoreBoard: isScoreBoard === true ? true : false
        });
    }

    render() {
        const { opponent1, opponent2, isScoreBoard, drawOdd } = this.state;
        const teamStyles = classNames("team", {
            "team-score-board" : isScoreBoard
        });

        return (
            <div styleName="teams">
                <div styleName={teamStyles}>
                    <ReactCountryFlag
                        countryCode={opponent1.location}
                        svg
                        style={{
                            width: '0.9em',
                            height: '0.9em',
                        }}
                        title={opponent1.location}
                    />
                    <Shield image={opponent1.image} size={"small"} />
                    <div styleName="name">
                        <Typography variant={'x-small-body'} color={'white'}>{opponent1.name}</Typography>
                        {
                            opponent1.odd != null
                            ?
                                <span>
                                    <Typography variant={'x-small-body'} color={'grey'}>{opponent1.odd}</Typography>
                                </span>
                            :
                                null
                        }
                    </div>
                </div>
                {
                    isScoreBoard === true
                    ?
                        <div styleName="score">
                            <div><Typography variant={'small-body'} color={'white'} weight={"bold"}>{opponent1.score}</Typography></div>
                            <div styleName="vs"><Typography variant={'x-small-body'} color={'grey'}>:</Typography></div>
                            <div><Typography variant={'small-body'} color={'white'} weight={"bold"}>{opponent2.score}</Typography></div>
                        </div>
                    :
                        <div styleName="triangle">
                            <div styleName="right-arrow"></div>
                            <div styleName="vs">
                                <Typography variant={'x-small-body'} color={'grey'}>
                                {drawOdd == null ? "VS" : drawOdd}
                                </Typography>
                            </div>
                            <div styleName="left-arrow"></div>
                        </div>
                }
                <div styleName={teamStyles}>
                    <ReactCountryFlag
                        countryCode={opponent2.location}
                        svg
                        style={{
                            width: '0.9em',
                            height: '0.9em',
                        }}
                        title={opponent2.location}
                    />
                    <Shield image={opponent2.image} size={"small"} />
                    <div styleName="name">
                        <Typography variant={'x-small-body'} color={'white'}>{opponent2.name}</Typography>
                        {
                            opponent2.odd != null
                            ?
                                <span>
                                    <Typography variant={'x-small-body'} color={'grey'}>{opponent2.odd}</Typography>
                                </span>
                            :
                                null
                        }
                    </div>
                </div>
            </div>
        )
    }
}