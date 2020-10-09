import React, { Component } from "react";
import { Typography } from 'components';
import { OddsTable, Live } from 'components/Esports';
import { dateToHourAndMinute, formatToBeautyDate } from "../../../lib/helpers";
import { connect } from 'react-redux';
import _ from 'lodash';
import "./index.css";


class Market extends Component {

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
                            <Typography variant={'small-body'} color={'white'}>{dateToHourAndMinute(match.begin_at)}</Typography>
                        </div>
                    </div>
                    {
                        match.live_embed_url != null
                        ?
                            <Live streaming={match.live_embed_url} match={match} />
                        :
                            null                     
                    }
                    <OddsTable match={match} />
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

export default connect(mapStateToProps)(Market);