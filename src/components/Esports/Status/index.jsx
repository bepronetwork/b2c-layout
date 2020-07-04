import React, { Component } from "react";
import { dateToHourAndMinute, formatToBeautyDate } from "../../../lib/helpers";
import { Typography, Button, LiveIcon } from 'components';
import classNames from "classnames";
import _ from 'lodash';
import "./index.css";


export default class Status extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date : null,
            status : null,
            hasLiveTransmition : false,
            isMobile : false
        };
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        const { hasLiveTransmition,  status, date, isMobile } = props;

        this.setState({
            date,
            status,
            hasLiveTransmition,
            isMobile
        });
    }

    renderPreMatch() {
        const { date } = this.state;

        return (
            <div styleName="match-schedule">
                <span>
                    <Typography color={'grey'} variant={'x-small-body'}>{dateToHourAndMinute(date)}</Typography>
                </span>
                <span>
                    <Typography color={'grey'} variant={'x-small-body'}>{formatToBeautyDate(date)}</Typography>
                </span>
            </div>
        );
    }

    renderFinished() {
        "finished"
        return (
            null
        )
    }

    renderLive() {
        const { hasLiveTransmition } = this.state;

        return (
            <div styleName="transmition">
                {hasLiveTransmition == true ? <LiveIcon/> : null }
                <Button size={'x-small'} theme="primary">
                    <Typography color={'fixedwhite'} variant={'x-small-body'}>Live</Typography>
                </Button>
            </div>
        )
    }

    render() {
        const { status, isMobile } = this.state;

        const styles = classNames("live", {
            "live-desktop" : isMobile != true,
            "live-mobile": isMobile == true
        });

        return (
            <div styleName={styles}>
                { status == "not_started" ? this.renderPreMatch() : null }
                { status == "running" ? this.renderLive() : null }
            </div>
        );
    }
}