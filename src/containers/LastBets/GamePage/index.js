import React, { Component } from "react";
import PropTypes from "prop-types";
import UserContext from "containers/App/UserContext";
import { connect } from "react-redux";
import { getLastBets, getBiggestBetWinners } from "../../../lib/api/app";
import { Numbers } from "../../../lib/ethereum/lib";
import { dateToHourAndMinute, getGames, getApp, getSkeletonColors } from "../../../lib/helpers";
import Tabs from "../../../components/Tabs";
import { SelectBox, Table } from 'components';
import { formatCurrency } from '../../../utils/numberFormatation';
import _ from 'lodash';
import { CopyText } from "../../../copy";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "./index.css";

import awardIcon from 'assets/icons/award.png';
import medalIcon from 'assets/icons/medal.png';
import flagIcon from 'assets/icons/flag.png';

const views = [{ text : 10, value : 10 }, { text : 25, value : 25 }, { text : 50, value : 50 }, { text : 100, value : 100 }];

const rows = {
    all_bets : {
        titles : [],
        fields : [
            {
                value : 'game',
                image : true,
            },
            {
                value : 'username'
            },
            {
                value : 'winAmount',
                dependentColor : true,
                condition : 'isWon'
            },
            {
                value : 'payout',
                dependentColor : true,
                condition : 'isWon'
            }
        ],
        rows : []
    },
    my_bets : {
        titles : [],
        fields : [
            {
                value : 'game',
                image : true
            },
            {
                value : 'winAmount',
                dependentColor : true,
                condition : 'isWon'
            },
            {
                value : 'payout',
                dependentColor : true,
                condition : 'isWon'
            }
        ],
        rows : []
    },
    biggest_win_bets : {
        titles : [],
        fields : [
            {
                value : 'game',
                image : true
            },
            {
                value : 'username'
            },
            {
                value : 'winAmount',
                dependentColor : true,
                condition : 'isWon'
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
    all_bets    : rows.all_bets,
    my_bets     : rows.my_bets,
    biggest_win_bets : rows.biggest_win_bets,
    view        : 'all_bets',
    view_amount : views[1],
    games : [],
    options : [],
    gameMetaName : null
}

class LastBets extends Component {
    static contextType = UserContext;

    static propTypes = {
        onHandleLoginOrRegister: PropTypes.func.isRequired
    };
    
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

    setTimer = (options) => {
        this.projectData(this.props, options)
    }

    handleTabChange = name => {
        this.setState({...this.state, view : name})
    };

    changeViewBets = ({option}) => {
        this.setTimer({view_amount : option})
    }
    
    projectData = async (props, options=null) => {
        let { profile, ln, gameMetaName } = props;
        let { view_amount } = this.state;
        const currencies = getApp().currencies;

        this.setState({...this.state, isLoading : true });

        const games = getGames();
        
        if(options){
            view_amount = options.view_amount ? options.view_amount : view_amount;
        }
        const copy = CopyText.homepagegame[ln];
        let all_bets = await getLastBets({size : view_amount.value});
        let biggest_winners_bets = await getBiggestBetWinners({size : view_amount.value});
        let my_bets = [];

        if(profile && !_.isEmpty(profile)){
            my_bets = await profile.getMyBets({size : view_amount.value});
        }
        this.setState({...this.state, 
            ...options,
            isLoading : false,
            gameMetaName,
            games,
            options : Object.keys(copy.TABLE).map( (key) => {

                let icon = null;
                const value = new String(key).toLowerCase();

                if(value === "all_bets"){
                    icon = medalIcon;
                }
                else if(value === "my_bets"){
                    icon = flagIcon;
                }
                else if(value === "biggest_win_bets"){
                    icon = awardIcon;
                }

                return {
                    value,
                    label : copy.TABLE[key].TITLE,
                    icon
                }
            }),
            all_bets : {
                ...this.state.all_bets,
                titles : copy.TABLE.ALL_BETS.ITEMS,
                rows : all_bets.map( (bet) =>  {
                    const currenncy = (currencies.find(currency => currency._id == bet.currency));
                    const ticker = currenncy ? currenncy.ticker : "";

                    return {
                        game: (games.find(game => new String(game.name).toLowerCase() == new String(bet.game).toLowerCase())),
                        id: new String(bet._id).slice(3, 15),
                        username: bet.username.length > 10 ? bet.username.substring(0, 4)+'...'+bet.username.substring(bet.username.length-3, bet.username.length) : bet.username,
                        timestamp: dateToHourAndMinute(bet.timestamp),
                        betAmount: formatCurrency(Numbers.toFloat(bet.betAmount))+' '+ticker,
                        winAmount: formatCurrency(Numbers.toFloat(bet.winAmount))+' '+ticker,
                        isWon : bet.isWon,
                        payout : `${formatCurrency(Numbers.toFloat(bet.winAmount/bet.betAmount))}x`,
                        ticker
                    }
                }).filter( el => (el.game.metaName == gameMetaName) && el.isWon === true)
            },
            my_bets : {
                ...this.state.my_bets,
                titles : copy.TABLE.MY_BETS.ITEMS,
                rows : my_bets.map( (bet) =>  {
                    const currenncy = (currencies.find(currency => currency._id == bet.currency));
                    const ticker = currenncy ? currenncy.ticker : "";

                    return {
                        game: (games.find(game => new String(game.name).toLowerCase() == new String(bet.game).toLowerCase())),
                        id: new String(bet._id).slice(3, 15),
                        timestamp: dateToHourAndMinute(bet.timestamp),
                        betAmount: formatCurrency(Numbers.toFloat(bet.betAmount))+' '+ticker,
                        winAmount: formatCurrency(Numbers.toFloat(bet.winAmount))+' '+ticker,
                        isWon : bet.isWon,
                        payout : `${formatCurrency(Numbers.toFloat(bet.winAmount/bet.betAmount))}x`
                    }
                }).filter( el => (el.game.metaName == gameMetaName))
            },
            biggest_win_bets  : {
                ...this.state.biggest_win_bets,
                titles : copy.TABLE.BIGGEST_WIN_BETS.ITEMS,
                rows : biggest_winners_bets.map( (bet) =>  {
                    const currenncy = (currencies.find(currency => currency._id == bet.currency));
                    const ticker = currenncy ? currenncy.ticker : "";

                    return {
                        game: (games.find(game => new String(game.name).toLowerCase() == new String(bet.game).toLowerCase())),
                        id: new String(bet._id).slice(3, 15),
                        username: bet.username.length > 10 ? bet.username.substring(0, 4)+'...'+bet.username.substring(bet.username.length-3, bet.username.length) : bet.username,
                        timestamp: dateToHourAndMinute(bet.timestamp),
                        betAmount: formatCurrency(Numbers.toFloat(bet.betAmount))+' '+ticker,
                        winAmount: formatCurrency(Numbers.toFloat(bet.winAmount))+' '+ticker,
                        isWon : bet.isWon,
                        payout : `${formatCurrency(Numbers.toFloat(bet.winAmount/bet.betAmount))}x`
                    }
                }).filter( el => (el.game.metaName == gameMetaName))
            }
        })
    }

    createSkeletonTabs = () => {
        let tabs = []

        for (let i = 0; i < 3; i++) {
          tabs.push(<div styleName="skeleton-main-item"><div styleName="skeleton-left-item"><Skeleton circle={true} height={30} width={30}/></div><div styleName="skeleton-right-item"><Skeleton height={30}/></div></div>);
        }

        return tabs
    }

    render() {
        const { isLoading, gameMetaName, games } = this.state;

        return (
            <div styleName='container'>
                {isLoading ?
                    <SkeletonTheme color={ getSkeletonColors().color} highlightColor={ getSkeletonColors().highlightColor}>
                        <div styleName='lastBets' style={{opacity : '0.3'}}>
                            <div styleName='skeleton-tabs'>
                                {this.createSkeletonTabs()}
                                <Skeleton width={50}/>
                            </div>
                        </div>
                    </SkeletonTheme>
                :
                    <div styleName='lastBets'>
                        <Tabs
                            selected={this.state.view}
                            options={this.state.options}
                            onSelect={this.handleTabChange}
                            color="primary"
                        />
                        <div styleName="filters">
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
                    games={games.filter(function(g) { return g.metaName == gameMetaName; }).map(function(g) { return g; })}
                    isLoading={isLoading}
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

export default connect(mapStateToProps)(LastBets);
