import React, { Component } from "react";
import { Typography } from 'components';
import { OddsTable, Live } from 'components/Esports';
import { dateToHourAndMinute, formatToBeautyDate } from "../../../lib/helpers";
import { connect } from 'react-redux';
import "./index.css";
import Countdown from 'react-countdown';
import moment from 'moment'

class Market extends Component {
    renderer = ({ total }) => {
        return (    
            <Typography variant={'small-body'} color={'white'}>{dateToHourAndMinute(moment().add(total, 'milliseconds'))}</Typography>
        )
    }

    render() {
        const { match } = this.props;
        const images = require.context('assets/esports', true);
        const image = images('./' + match.videogame.slug + '.jpg');

        return (
            <div styleName="middle" style={{background: "url('" + image + "') center center / cover no-repeat"}} >
                <div styleName="market">
                    <div styleName="info">
                        <div styleName="title">
                            <Typography variant={'h4'} color={'white'}>Upcoming Match</Typography>
                        </div>
                        <div styleName="date">
                            <Typography variant={'x-small-body'} color={'grey'}>{formatToBeautyDate(match.begin_at)}</Typography>
                        </div>
                        <div styleName="time">
                            <Countdown date={match.begin_at} renderer={this.renderer}/>
                        </div>
                    </div>
                    {
                        match.live_embed_url !== null
                        ?
                            <Live streaming={match.live_embed_url} match={match} />
                        :
                            <OddsTable match={match} />                     
                    }
                </div>
            </div>
        );
    }
}

export default Market;