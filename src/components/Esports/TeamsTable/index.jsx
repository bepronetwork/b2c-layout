import React, { Component } from "react";
import { Stats, Players } from 'components/Esports';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { getTeam } from "controllers/Esports/EsportsUser";
import { getSkeletonColors } from "../../../lib/helpers";
import { connect } from 'react-redux';
import _ from 'lodash';
import "./index.css";


class TeamsTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            team1 : null,
            team2 : null,
            hasPlayers : false,
            isLoading: true
        };
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        let { hasPlayers } = this.state;
        const { match } = props;

        const slug = match.videogame.slug;
        let team1 = match.opponents[0].opponent;
        let team2 = match.opponents[1].opponent;

        if (slug == "league-of-legends") {
            const teamId1 = match.opponents[0].opponent.id;
            const teamId2 = match.opponents[1].opponent.id;
            team1 = await getTeam(teamId1, slug);
            team2 = await getTeam(teamId2, slug);

            hasPlayers = true;
        }

        this.setState({
            team1,
            team2,
            hasPlayers,
            isLoading: false
        });
    }

    render() {
        const { team1, team2, hasPlayers, isLoading } = this.state;
        const { match, onPlayerClick } = this.props;

        return (
            isLoading ?
                <SkeletonTheme color={ getSkeletonColors().color} highlightColor={ getSkeletonColors().highlightColor}>
                    <div style={{opacity : '0.5'}}> 
                        <Skeleton height={200} width={"100%"}/>
                    </div>
                </SkeletonTheme>
            :
                <div>
                    <Stats match={match} team1={team1} team2={team2} hasPlayers={hasPlayers} />
                    <Players match={match} team1={team1} team2={team2} hasPlayers={hasPlayers} onPlayerClick={onPlayerClick} />
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

export default connect(mapStateToProps)(TeamsTable);