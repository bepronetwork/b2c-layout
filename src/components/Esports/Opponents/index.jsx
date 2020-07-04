import React, { Component } from "react";
import { Typography } from 'components';
import { Shield } from "components/Esports";
import classNames from 'classnames';
import _ from 'lodash';
import "./index.css";


export default class Opponents extends Component {

    constructor(props) {
        super(props);
        this.state = {
            opponent1: {
                country: "https://image.flaticon.com/icons/svg/197/197484.svg",
                image: null,
                name: "Team 1",
                score: 0,
                odd: null
            },
            opponent2: {
                country: "https://image.flaticon.com/icons/svg/197/197484.svg",
                image: null,
                name: "Team 2",
                score: 0,
                odd: null
            },
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
        const { opponent1, opponent2 } = this.state;

        if(_.isEmpty(opponents)) {
            opponent1.image = gameImage;
            opponent2.image = gameImage;
        }
        else {
            opponent1.image = opponents[0].opponent.image_url;
            opponent1.name  = opponents[0].opponent.name;
            opponent1.score = results.find(r => r.team_id == opponents[0].opponent.id).score;
            if(odds != null) {
                opponent1.odd = odds.winnerTwoWay.find(o => o.participant_id == opponents[0].opponent.id).probability;
            }

            opponent2.image = opponents[1].opponent.image_url;
            opponent2.name  = opponents[1].opponent.name;
            opponent2.score = results.find(r => r.team_id == opponents[1].opponent.id).score;
            if(odds != null) {
                opponent2.odd = odds.winnerTwoWay.find(o => o.participant_id == opponents[1].opponent.id).probability;
            }
        }

        this.setState({
            opponent1,
            opponent2,
            isScoreBoard: isScoreBoard === true ? true : false
        });
    }

    render() {
        const { opponent1, opponent2, isScoreBoard } = this.state;
        const teamStyles = classNames("team", {
            "team-score-board" : isScoreBoard
        });

        return (
            <div styleName="teams">
                <div styleName={teamStyles}>
                    <img src="https://image.flaticon.com/icons/svg/197/197484.svg" />
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
                            <div><Typography variant={'small-body'} color={'white'} weight={"bold"}>1</Typography></div>
                            <div styleName="vs"><Typography variant={'x-small-body'} color={'grey'}>:</Typography></div>
                            <div><Typography variant={'small-body'} color={'white'} weight={"bold"}>0</Typography></div>
                        </div>
                    :
                        <div styleName="triangle">
                            <div styleName="right-arrow"></div>
                            <div styleName="vs"><Typography variant={'x-small-body'} color={'grey'}>VS</Typography></div>
                            <div styleName="left-arrow"></div>
                        </div>
                }
                <div styleName={teamStyles}>
                    <img src="https://image.flaticon.com/icons/svg/197/197484.svg" />
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