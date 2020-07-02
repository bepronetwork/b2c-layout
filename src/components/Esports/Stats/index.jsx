import React, { Component } from "react";
import { Typography } from 'components';
import { connect } from 'react-redux';
import classNames from "classnames";
import moment from 'moment-timezone';
import _ from 'lodash';
import "./index.css";


class Stats extends Component {

    constructor(props){
        super(props);
        this.state = {
            stats1: [
                { index: 0 , month: "JAN", matchesWon: 0, matchesPlayed: 0 },
                { index: 1 , month: "FEB", matchesWon: 0, matchesPlayed: 0 },
                { index: 2 , month: "MAR", matchesWon: 0, matchesPlayed: 0 },
                { index: 3 , month: "APR", matchesWon: 0, matchesPlayed: 0 },
                { index: 4 , month: "MAY", matchesWon: 0, matchesPlayed: 0 },
                { index: 5 , month: "JUN", matchesWon: 0, matchesPlayed: 0 },
                { index: 6 , month: "JUL", matchesWon: 0, matchesPlayed: 0 },
                { index: 7 , month: "AUG", matchesWon: 0, matchesPlayed: 0 },
                { index: 8 , month: "SEP", matchesWon: 0, matchesPlayed: 0 },
                { index: 9 , month: "OCT", matchesWon: 0, matchesPlayed: 0 },
                { index: 10, month: "NOV", matchesWon: 0, matchesPlayed: 0 },
                { index: 11, month: "DEC", matchesWon: 0, matchesPlayed: 0 }
            ],
            stats2: [
                { index: 0 , month: "JAN", matchesWon: 0, matchesPlayed: 0 },
                { index: 1 , month: "FEB", matchesWon: 0, matchesPlayed: 0 },
                { index: 2 , month: "MAR", matchesWon: 0, matchesPlayed: 0 },
                { index: 3 , month: "APR", matchesWon: 0, matchesPlayed: 0 },
                { index: 4 , month: "MAY", matchesWon: 0, matchesPlayed: 0 },
                { index: 5 , month: "JUN", matchesWon: 0, matchesPlayed: 0 },
                { index: 6 , month: "JUL", matchesWon: 0, matchesPlayed: 0 },
                { index: 7 , month: "AUG", matchesWon: 0, matchesPlayed: 0 },
                { index: 8 , month: "SEP", matchesWon: 0, matchesPlayed: 0 },
                { index: 9 , month: "OCT", matchesWon: 0, matchesPlayed: 0 },
                { index: 10, month: "NOV", matchesWon: 0, matchesPlayed: 0 },
                { index: 11, month: "DEC", matchesWon: 0, matchesPlayed: 0 }
            ]
        };
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        const { stats1, stats2 } = this.state;
        const { team1, team2, hasPlayers } = props;

        this.setState({
            stats1: hasPlayers == true ? await this.formatStatsByDate(team1.stats, stats1) : stats1,
            stats2: hasPlayers == true ? await this.formatStatsByDate(team2.stats, stats2) : stats2
        });

    }

    async formatStatsByDate(stats, teamStats) {

        let aggregatedStats = teamStats;
        const oneYearAgoDate = moment().subtract(0.9, 'year').set("date", 1).startOf('day');

        stats.map(s => {
            const beginDate = moment(s.serie.begin_at);
            const endDate = !_.isEmpty(s.serie.end_at) ? moment(s.serie.end_at) : null;

            if(moment(oneYearAgoDate).isBefore(endDate) || (moment(oneYearAgoDate).isBefore(beginDate) && endDate == null)) {

                if(endDate == null || beginDate.month() == endDate.month()) {
                    aggregatedStats = aggregatedStats.map(a =>
                        a.index === beginDate.month()
                          ? { ...a, 
                                matchesWon: a.matchesWon + s.totals.matches_won,
                                matchesPlayed: a.matchesPlayed + s.totals.matches_played
                            }
                          : 
                          a
                    );
                }
                else {
                    const beginMonth = moment(beginDate).month();
                    const oneYearMonth = moment(oneYearAgoDate).month();
                    var i = 0; var month = 0; do { 
                        month = moment(endDate).subtract(i, 'month').month();
                        i++; 

                        aggregatedStats = aggregatedStats.map(a =>
                            a.index === month
                              ? { ...a, 
                                    matchesWon: a.matchesWon + s.totals.matches_won,
                                    matchesPlayed: a.matchesPlayed + s.totals.matches_played
                                }
                              : 
                              a
                        );
                        
                    } while (month != beginMonth &&  month != oneYearMonth);
                }
            }
        });

        return aggregatedStats;
    }

    renderMonthPerformance() {
        for(let i=0; i<5; i++){
            return (
                <div>{i}</div>
            )
        }
    }

    renderHistoryPerformance() {
        const { stats1, stats2 } = this.state;
        let performance = [];

        var i = 0; var month = 0; do { 
            month = moment().subtract(i, 'month').month();
            i++; 

            const monthName = stats1.find(s => s.index === month).month;

            const stat1 = stats1.find(s => s.index === month)
            const stat2 = stats2.find(s => s.index === month)

            const sumWon1 = stat1.matchesWon;
            const sumWon2 = stat2.matchesWon;
    
            const sumPlayed1 = stat1.matchesPlayed;
            const sumPlayed2 = stat2.matchesPlayed;
    
            const performance1 = sumPlayed1 > 0 ? ( sumWon1 / sumPlayed1 ) * 100 : "N/A";
            const performance2 = sumPlayed2 > 0 ? ( sumWon2 / sumPlayed2 ) * 100 : "N/A";

            const rate1Label = sumPlayed1 > 0 ? performance1.toFixed(0)+'%' : "N/A";
            const rate2Label = sumPlayed2 > 0 ? performance2.toFixed(0)+'%' : "N/A";

            performance.push({
                month: monthName,
                performance1,
                performance2,
                rate1Label,
                rate2Label
            });
            
        } while (i < 12);

        return (
            performance.map(p => {
                const styles1 = classNames("progress", {
                    green: p.performance1 >= 60,
                    red: p.performance1 < 30,
                    yellow: p.performance1 >= 30 && p.performance1 < 60
                });
        
                const styles2 = classNames("progress", {
                    green: p.performance2 >= 60,
                    red: p.performance2 < 30,
                    yellow: p.performance2 >= 30 && p.performance2 < 60
                });

                return (
                    <div styleName="history">
                        <div styleName="bar">
                            <span style={{ width: p.rate1Label}}>
                                <span styleName={styles1}></span>
                            </span>
                        </div>
                        <div>
                            <Typography variant={'x-small-body'} color={'white'}>{p.rate1Label}</Typography>
                        </div>
                        <div styleName="history-month">
                            <Typography variant={'x-small-body'} color={'grey'}>{p.month}</Typography>
                        </div>
                        <div>
                            <Typography variant={'x-small-body'} color={'white'}>{p.rate2Label}</Typography>
                        </div>
                        <div styleName="bar">
                            <span style={{ width: p.rate2Label}}>
                                <span styleName={styles2}></span>
                            </span>
                        </div>
                    </div>
                )
            })
        )
    }

    render() {
        const { team1, team2 } = this.props;
        const { stats1, stats2 } = this.state;

        const sumWon1 = stats1.reduce((a, b) => +a + +b.matchesWon, 0);
        const sumWon2 = stats2.reduce((a, b) => +a + +b.matchesWon, 0);

        const sumPlayed1 = stats1.reduce((a, b) => +a + +b.matchesPlayed, 0);
        const sumPlayed2 = stats2.reduce((a, b) => +a + +b.matchesPlayed, 0);

        const performance1 = ( sumWon1 / sumPlayed1 ) * 100;
        const performance2 = ( sumWon2 / sumPlayed2 ) * 100;

        return (
            <div styleName="stats-menu">
                <div styleName="stats-title">
                    <Typography variant={'small-body'} color={'white'}>Team performance</Typography>
                    <Typography variant={'x-small-body'} color={'white'}>Win rate pf the past 12 months</Typography>
                </div>
                <div styleName="stats-score">
                    <div>
                        <div styleName="score-team">
                            <Typography variant={'x-small-body'} color={'white'}>{team1.name}</Typography>
                        </div>
                        <div styleName="score-number">
                            <Typography variant={'body'} color={'white'}>{performance1.toFixed(0)}%</Typography>
                        </div>
                    </div>
                    <div>
                        <div styleName="score-team">
                            <Typography variant={'x-small-body'} color={'white'}>{team2.name}</Typography>
                        </div>
                        <div styleName="score-number">
                            <Typography variant={'body'} color={'white'}>{performance2.toFixed(0)}%</Typography>
                        </div>
                    </div>
                </div>
                <div>
                    {this.renderHistoryPerformance()}
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