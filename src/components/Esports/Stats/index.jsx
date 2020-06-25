import React, { Component } from "react";
import { Typography } from 'components';
import { connect } from 'react-redux';
import classNames from "classnames";
import _ from 'lodash';
import "./index.css";


class Stats extends Component {

    constructor(props){
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }

    renderMonthPerformance(month) {
        const { match } = this.props;
        const stat1 = match.teams[0].stats.find(s => s.month == month);
        const stat2 = match.teams[1].stats.find(s => s.month == month);

        const rate1 = stat1 ? stat1.rate : "N/A";
        const rate2 = stat2 ? stat2.rate : "N/A";
        const rate1Label = stat1 ? stat1.rate+'%' : "N/A";
        const rate2Label = stat2 ? stat2.rate+'%' : "N/A";

        const styles1 = classNames("progress", {
            green: rate1 >= 60,
            red: rate1 < 30,
            yellow: rate1 >= 30 && rate1 < 60
        });

        const styles2 = classNames("progress", {
            green: rate2 >= 60,
            red: rate2 < 30,
            yellow: rate2 >= 30 && rate2 < 60
        });

        return (
            <div styleName="history">
                <div styleName="bar">
                    <span style={{ width: rate1Label}}>
                        <span styleName={styles1}></span>
                    </span>
                </div>
                <div>
                    <Typography variant={'x-small-body'} color={'white'}>{rate1Label}</Typography>
                </div>
                <div styleName="history-month">
                    <Typography variant={'x-small-body'} color={'grey'}>{month}</Typography>
                </div>
                <div>
                    <Typography variant={'x-small-body'} color={'white'}>{rate2Label}</Typography>
                </div>
                <div styleName="bar">
                    <span style={{ width: rate2Label}}>
                        <span styleName={styles2}></span>
                    </span>
                </div>
            </div>
        )
    }

    render() {

        const { match } = this.props;
        const sum1 = match.teams[0].stats.reduce((a, b) => +a + +b.rate, 0);
        const sum2 = match.teams[1].stats.reduce((a, b) => +a + +b.rate, 0);

        const performance1 = sum1 / match.teams[0].stats.length;
        const performance2 = sum2 / match.teams[1].stats.length;

        return (
            <div styleName="stats-menu">
                <div styleName="stats-title">
                    <Typography variant={'small-body'} color={'white'}>Team performance</Typography>
                    <Typography variant={'x-small-body'} color={'white'}>Win rate pf the past 12 months</Typography>
                </div>
                <div styleName="stats-score">
                    <div>
                        <div styleName="score-team">
                            <Typography variant={'x-small-body'} color={'white'}>{match.teams[0].name}</Typography>
                        </div>
                        <div styleName="score-number">
                            <Typography variant={'body'} color={'white'}>{performance1.toFixed(0)}%</Typography>
                        </div>
                    </div>
                    <div>
                        <div styleName="score-team">
                            <Typography variant={'x-small-body'} color={'white'}>{match.teams[1].name}</Typography>
                        </div>
                        <div styleName="score-number">
                            <Typography variant={'body'} color={'white'}>{performance2.toFixed(0)}%</Typography>
                        </div>
                    </div>
                </div>
                <div>
                    {this.renderMonthPerformance("JAN")}
                    {this.renderMonthPerformance("FEB")}
                    {this.renderMonthPerformance("MAR")}
                    {this.renderMonthPerformance("APR")}
                    {this.renderMonthPerformance("MAY")}
                    {this.renderMonthPerformance("JUN")}
                    {this.renderMonthPerformance("JUL")}
                    {this.renderMonthPerformance("AUG")}
                    {this.renderMonthPerformance("SEP")}
                    {this.renderMonthPerformance("OCT")}
                    {this.renderMonthPerformance("NOV")}
                    {this.renderMonthPerformance("DEC")}
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

export default connect(mapStateToProps)(Stats);