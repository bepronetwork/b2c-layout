import React, { Component } from "react";
import { Typography } from 'components';
import { BetsTable } from 'components/Esports';
import { connect } from 'react-redux';
import _ from 'lodash';
import "./index.css";


class Market extends Component {

    render() {

        const { match } = this.props;

        return (
            <div styleName="middle" style={{background: "url('" + match.image + "') center center / cover no-repeat"}} >
                <div styleName="market">
                    <div styleName="info">
                        <div styleName="title">
                            <Typography variant={'h4'} color={'white'}>Upcoming Match</Typography>
                        </div>
                        <div styleName="date">
                            <Typography variant={'x-small-body'} color={'grey'}>8th June, Tuesday, 7:00 pm</Typography>
                        </div>
                        <div styleName="time">
                            <Typography variant={'small-body'} color={'white'}>7H : 30M : 48S</Typography>
                        </div>
                    </div>
                    <BetsTable match={match} />
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