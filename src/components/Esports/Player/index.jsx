import React, { Component } from "react";
import { Typography } from 'components';
import ReactCountryFlag from "react-country-flag"
import { connect } from 'react-redux';
import "./index.css";

class Player extends Component {

    constructor(props){
        super(props);
    }

    render() {
        const { player } = this.props;

        return (
            <div styleName="player">
                <div styleName="picture">
                    <img src={player.image_url} width="100%"/>
                </div>
                <div styleName="info">
                    <div styleName="top">
                        <div styleName="name">
                            <Typography variant={'body'} color={'white'}>{player.name}</Typography>
                        </div>
                        <div styleName="flag">
                            <ReactCountryFlag
                                countryCode={player.nationality}
                                className="emojiFlag"
                                style={{
                                    width: '1em',
                                    height: '1em',
                                }}
                                title={player.hometown}
                            />
                        </div>
                    </div>
                    <div styleName="field">
                        <div>
                            <Typography variant={'x-small-body'} color={'grey'}>Name:</Typography>
                        </div>
                        <div>
                            <Typography variant={'small-body'} color={'white'}>{player.first_name} {player.last_name}</Typography>
                        </div>
                    </div>
                    <div styleName="field">
                        <div>
                            <Typography variant={'x-small-body'} color={'grey'}>Home Town:</Typography>
                        </div>
                        <div>
                            <Typography variant={'small-body'} color={'white'}>{player.hometown}</Typography>
                        </div>
                    </div>
                    <div styleName="field">
                        <div>
                            <Typography variant={'x-small-body'} color={'grey'}>Role:</Typography>
                        </div>
                        <div>
                            <Typography variant={'small-body'} color={'white'}>{player.role}</Typography>
                        </div>
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

export default connect(mapStateToProps)(Player);