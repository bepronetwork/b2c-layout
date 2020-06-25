import React, { Component } from "react";
import { Typography, Tabs, LiveIcon } from 'components';
import { connect } from 'react-redux';
import classNames from "classnames";
import _ from 'lodash';
import "./index.css";


class Players extends Component {

    constructor(props){
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }

    renderPlayers() {
        const { match } = this.props;

        return (
            <div styleName="players">
                <div styleName="left-column">
                    {
                        match.teams[0].players.map(p => {
                            return (
                                <div styleName="player" key={p.nickName}>
                                    <div styleName="description">
                                        <span styleName="name">
                                            <Typography variant={'x-small-body'} color={'white'}>
                                                {p.nickName}
                                            </Typography>
                                        </span>
                                        <span styleName="name">
                                            <Typography variant={'x-small-body'} color={'grey'}>
                                                {p.fullName}
                                            </Typography>
                                        </span>
                                    </div>
                                    <div styleName="player-country"><img src={p.country} /></div>
                                </div>
                            )
                        })
                    }
                </div>
                <div styleName="right-column">
                    {
                        match.teams[1].players.map(p => {
                            return (
                                <div styleName="player" key={p.nickName}>
                                    <div styleName="description">
                                        <span styleName="name">
                                            <Typography variant={'x-small-body'} color={'white'}>
                                                {p.nickName}
                                            </Typography>
                                        </span>
                                        <span styleName="name">
                                            <Typography variant={'x-small-body'} color={'grey'}>
                                                {p.fullName}
                                            </Typography>
                                        </span>
                                    </div>
                                    <div styleName="player-country"><img src={p.country} /></div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

    render() {

        const { match } = this.props;

        return (
            <div styleName="players-menu">
                <div styleName="players-title">
                    <Typography variant={'small-body'} color={'white'}>Expected Rosters</Typography>
                    <Typography variant={'x-small-body'} color={'white'}>Final rosters may differ</Typography>
                </div>
                <div styleName="teams">
                    <div>
                        <div styleName="team">
                            <Typography variant={'x-small-body'} color={'white'}>{match.teams[0].name}</Typography>
                        </div>
                    </div>
                    <div>
                        <div styleName="team">
                            <Typography variant={'x-small-body'} color={'white'}>{match.teams[1].name}</Typography>
                        </div>
                    </div>
                </div>
                <div>
                    {this.renderPlayers()}
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