import React, { Component } from "react";
import { connect } from "react-redux";
import { Typography } from 'components';
import { Shield } from "components/Esports";
import { formatOpponentData, formatToBeautyDate } from "../../../../lib/helpers";
import classNames from "classnames";
import _ from 'lodash';
import "./index.css";

const stateOptions = Object.freeze({
    won: { text: "Won", color: "green" },
    lost: { text: "Lost", color: "red" },
    pending: { text: "Pending", color: "primaryLight" }
});

class Match extends Component {

    constructor(props){
        super(props);
        this.state = {
            bet: null,
            match: null,
            opponent1: null,
            opponent2: null,
            isLoaded: false
        };
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        const { bet, match } = this.props;
        let { opponent1, opponent2 } = this.state;
        const images = require.context('assets/esports', true);
        const gameImage = images('./' + match.videogame.slug + '-ico.png');

        opponent1 = formatOpponentData(match, 0, gameImage);
            
        opponent2 = formatOpponentData(match, 1, gameImage);

        this.setState({
            bet,
            match,
            opponent1,
            opponent2,
            isLoaded: true
        })

    }
    
    render() {
        const { bet, match, opponent1, opponent2, isLoaded } = this.state;

        if(!isLoaded) { return null };

        const result = bet.result.find(r => r.match.external_id == match.id);

        const team1Styles = classNames("team", "team1", {
            "selected" : result.participantId == opponent1.id
        });

        const team2Styles = classNames("team", "team2", {
            "selected" : result.participantId == opponent2.id
        });

        const isDraw = result.participantId == 0;

        const stateOption = result.status == "pending" ? stateOptions.pending : result.status == "gain" ? stateOptions.won : stateOptions.lost;
        const stateStyles = classNames("status", [stateOption.color]);

        return (
            <div styleName="match">
                <div styleName="date">
                    <Typography variant={'x-small-body'} color={'white'}>{formatToBeautyDate(match.begin_at)}</Typography>
                </div>
                <div styleName="teams">
                    <div styleName={team1Styles}>
                        <Shield image={opponent1.image} size={"small"} />
                        <div styleName="name">
                            <Typography variant={'x-small-body'} color={'white'}>{opponent1.name}</Typography>
                        </div>
                    </div>
                    <div styleName="score">
                        <div><Typography variant={'small-body'} color={'white'} weight={"bold"}>{opponent1.score}</Typography></div>
                        <div styleName="vs">
                            {
                                isDraw == true
                                ?
                                    <div styleName="draw">
                                        <Typography variant={'x-small-body'} color={'white'}>DRAW</Typography>
                                    </div>
                                :
                                    <Typography variant={'x-small-body'} color={'grey'}>:</Typography>
                            }
                        </div>
                        <div><Typography variant={'small-body'} color={'white'} weight={"bold"}>{opponent2.score}</Typography></div>
                    </div>
                    <div styleName={team2Styles}>
                        <Shield image={opponent2.image} size={"small"} />
                        <div styleName="name">
                            <Typography variant={'x-small-body'} color={'white'}>{opponent2.name}</Typography>
                        </div>
                    </div>
                </div>
                <div styleName="info">
                    <div styleName="result">
                        <div styleName="main-info">
                            <Shield image={match.league.image_url} size={"small"} isFull={true} />
                            <div styleName="left">
                                <div styleName="text">
                                    <Typography variant={'small-body'} color={'white'}>{match.league.name}</Typography>
                                    <span>
                                        <Typography variant={'x-small-body'} color={'grey'}>{match.serie.full_name}</Typography>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div styleName="result">
                        <div styleName="main">
                            <div styleName="main-info">
                                <div styleName="left">
                                    <div styleName="text">
                                        <Typography variant={'x-small-body'} color={'white'}>Status:</Typography>
                                    </div>
                                </div>
                            </div>
                            <div styleName="right">
                                <div styleName={stateStyles}>
                                    <Typography variant={'x-small-body'} color={`fixedwhite`} weight={"bold"}>
                                        {stateOption.text}
                                    </Typography>
                                </div>
                            </div>
                        </div>
                        <div styleName="main">
                            <div styleName="main-info">
                                <div styleName="left">
                                    <div styleName="text">
                                        <Typography variant={'x-small-body'} color={'white'}>Odd:</Typography>
                                    </div>
                                </div>
                            </div>
                            <div styleName="right">
                                <Typography variant={'x-small-body'} color={'white'}>{(1 / result.statistic).toFixed(2)}</Typography>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile,
        ln : state.language
    };
}

export default connect(mapStateToProps)(Match);
