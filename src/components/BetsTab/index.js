import React, { Component } from "react";
import { connect } from "react-redux";
import { Numbers } from "../../lib/ethereum/lib";
import { dateToHourAndMinute, getGames, getSkeletonColors } from "../../lib/helpers";
import { SelectBox, Table, RewardIcon } from 'components';
import { formatCurrency } from "../../utils/numberFormatation";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { CopyText } from "../../copy";
import _ from 'lodash';
import "./index.css";

const views = [{ text : 10, value : 10 }, { text : 25, value : 25 }, { text : 50, value : 50 }, { text : 100, value : 100 }];
const allGames =  { text : 'All Games', value : 'all_games' };

const rows = {
    my_bets : {
        titles : [],
        fields : [
            {
                value : 'game',
                image : true
            },
            {
                value : 'id'
            },
            {
                value : 'timestamp'
            },
            {
                value : 'winAmount',
                dependentColor : true,
                condition : 'isWon',
                currency: true
            },
            {
                value : 'payout',
                dependentColor : true,
                condition : 'isWon'
            }
        ],
        rows : []
    }
}
  

const defaultProps = {
    my_bets     : rows.my_bets,
    view        : 'my_bets',
    view_amount : views[1],
    gamesOptions : [],
    games : [],
    options : [],
    view_game : allGames,
    isLoading: true,
    isListLoading : true
}

class BetsTab extends Component {

    constructor(props){
        super(props);
        this.state = defaultProps;
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        if(props !== this.props) {
            this.projectData(props);
        }
    }

    projectData = async (props, options=null) => {
        let { profile, ln } = props;
        let { view_amount, view_game } = this.state;
        const copy = CopyText.betspage[ln];
        let my_bets = [];

        let games = getGames().filter(g => g.metaName != 'jackpot_auto');
        let gamesOptions = [];
        gamesOptions.push(allGames);

        games.map( (data) => {
            const n = {
                value :  data.metaName,
                text : data.name
            }
            gamesOptions.push(n);
        });

        if(options){
            view_amount = options.view_amount ? options.view_amount : view_amount;
            view_game = options.view_game ? options.view_game : view_game;
        }

        if(profile && !_.isEmpty(profile)){
            if(view_game.value != "all_games") {
                const gameId = games.find(g =>g.metaName === view_game.value)._id;
                my_bets = await profile.getMyBets({size : view_amount.value, game : gameId});
            }
            else {
                my_bets = await profile.getMyBets({size : view_amount.value});
            }
        }

        this.setState({...this.state, 
            ...options,
            isLoading : false,
            isListLoading : false,
            games,
            gamesOptions,
            options : Object.keys(copy.TABLE).map( (key) => {
                const value = new String(key).toLowerCase();
                return {
                    value,
                    label : copy.TABLE[key].TITLE,
                    icon : RewardIcon
                }
            }),
            my_bets : {
                ...this.state.my_bets,
                titles : copy.TABLE.MY_BETS.ITEMS,
                rows : my_bets.map( (bet) =>  {
                    return {
                        game: (games.find(game => game._id === bet.game)),
                        id: new String(bet._id).slice(3, 15),
                        timestamp: dateToHourAndMinute(bet.timestamp),
                        betAmount: formatCurrency(Numbers.toFloat(bet.betAmount)),
                        winAmount: formatCurrency(Numbers.toFloat(bet.winAmount)),
                        currency: bet.currency,
                        isWon : bet.isWon,
                        payout : `${formatCurrency(Numbers.toFloat(bet.winAmount/bet.betAmount))}x`
                    }
                })
            }
        })
    }

    setTimer = (options) => {
        this.projectData(this.props, options)
    }

    changeViewBets = ({option}) => {
        this.setState({...this.state, isListLoading : true })
        this.setTimer({view_amount : option})
    }

    changeViewGames = ({option}) => {
        this.setState({...this.state, isListLoading : true })
        this.setTimer({view_game : option})
    }

    render() {
        const { games, gamesOptions, isLoading, isListLoading, view_game } = this.state;

        return (
            <div styleName='container'>
                {isLoading ?
                    <SkeletonTheme color={ getSkeletonColors().color} highlightColor={ getSkeletonColors().highlightColor}>
                        <div styleName='lastBets' style={{opacity : '0.5'}}>
                            <div styleName='filters'>
                                <div styleName='bets-dropdown-game'>
                                    <Skeleton width={100} height={30}/>
                                </div>
                                <div styleName='bets-dropdown'>
                                    <Skeleton width={50} height={30}/>
                                </div>
                            </div>
                        </div>
                    </SkeletonTheme>
                :
                    <div styleName='lastBets'>
                        <div styleName="filters">
                            <div styleName='bets-dropdown-game'>
                                <SelectBox
                                    onChange={(e) => this.changeViewGames(e)}
                                    options={gamesOptions}
                                    value={this.state.view_game}
                                /> 
                            </div>

                            <div styleName='bets-dropdown'>
                                <SelectBox
                                    onChange={(e) => this.changeViewBets(e)}
                                    options={views}
                                    value={this.state.view_amount}
                                /> 
                            </div>
                        </div>
                    </div>
                }
                <Table
                    rows={this.state[this.state.view].rows}
                    titles={this.state[this.state.view].titles}
                    fields={this.state[this.state.view].fields}
                    showRealTimeLoading={this.state.view == "all_bets" ? true : false}
                    size={this.state.view_amount.value}
                    games={games.filter(function(g) { return view_game.value == 'all_games' || g.metaName == view_game.value; }).map(function(g) { return g; })}
                    isLoading={isListLoading}
                /> 
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile,
        ln : state.language
    };
}

export default connect(mapStateToProps)(BetsTab);
