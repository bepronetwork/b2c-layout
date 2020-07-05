import React, { Component } from "react";
import { Typography, Tabs, LiveIcon } from 'components';
import { connect } from 'react-redux';
import { Shield } from "components/Esports";
import ReactCountryFlag from "react-country-flag"
import _ from 'lodash';
import "./index.css";


class Players extends Component {

    constructor(props){
        super(props);
        this.state = {
        };
    }
    
    renderPlayers() {
        const { team1, team2 } = this.props;

        return (
            <div styleName="players">
                <div styleName="left-column">
                    {
                        team1.players.map(p => {
                            return (
                                <div styleName="player" key={p.name}>
                                    <div styleName="description">
                                        <span styleName="name">
                                            <Typography variant={'x-small-body'} color={'white'}>
                                                {p.name}
                                            </Typography>
                                        </span>
                                        <span styleName="name">
                                            <Typography variant={'x-small-body'} color={'grey'}>
                                                {`${p.first_name} ${p.last_name}`}
                                            </Typography>
                                        </span>
                                    </div>
                                    <div styleName="player-country">
                                        <ReactCountryFlag
                                            countryCode={p.nationality}
                                            className="emojiFlag"
                                            style={{
                                                width: '1em',
                                                height: '1em',
                                            }}
                                            title={p.hometown}
                                        />
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div styleName="right-column">
                    {
                        team2.players.map(p => {
                            return (
                                <div styleName="player" key={p.name}>
                                    <div styleName="description">
                                        <span styleName="name">
                                            <Typography variant={'x-small-body'} color={'white'}>
                                                {p.name}
                                            </Typography>
                                        </span>
                                        <span styleName="name">
                                            <Typography variant={'x-small-body'} color={'grey'}>
                                                {`${p.first_name} ${p.last_name}`}
                                            </Typography>
                                        </span>
                                    </div>
                                    <div styleName="player-country">
                                        <ReactCountryFlag
                                            countryCode={p.nationality}
                                            className="emojiFlag"
                                            style={{
                                                width: '1em',
                                                height: '1em',
                                            }}
                                            title={p.hometown}
                                        />
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

    render() {
        const { team1, team2, hasPlayers } = this.props;

        return (
            <div styleName="players-menu">
                <div styleName="players-title">
                    <Typography variant={'small-body'} color={'white'}>Expected Rosters</Typography>
                    <Typography variant={'x-small-body'} color={'white'}>Final rosters may differ</Typography>
                </div>
                <div styleName="teams">
                    <div>
                        <div styleName="shield">
                            <Shield image={team1.image_url} size={"medium"} />
                        </div>
                        <div styleName="team">
                            <Typography variant={'x-small-body'} color={'white'}>{team1.name}</Typography>
                        </div>
                    </div>
                    <div>
                        <div styleName="shield">
                            <Shield image={team2.image_url} size={"medium"} />
                        </div>
                        <div styleName="team">
                            <Typography variant={'x-small-body'} color={'white'}>{team2.name}</Typography>
                        </div>
                    </div>
                </div>
                <div>
                {
                    hasPlayers === true 
                    ?
                        this.renderPlayers()
                    :
                        <div styleName="empty">
                            <Typography variant={'x-small-body'} color={'white'}>
                                No info available at the moment. Stay tuned...
                            </Typography>
                        </div>
                }
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

export default connect(mapStateToProps)(Players);