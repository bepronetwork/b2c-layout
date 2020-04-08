import React, { Component } from "react";
import PropTypes from "prop-types";
import UserContext from "containers/App/UserContext";
import { connect } from "react-redux";
import { getLastBets, getBiggestUserWinners, getBiggestBetWinners } from "../../../lib/api/app";
import { Numbers } from "../../../lib/ethereum/lib";
import { dateToHourAndMinute, getGames, getApp } from "../../../lib/helpers";
import Tabs from "../../../components/Tabs";
import { SelectBox, Table } from 'components';
import _ from 'lodash';
import { CopyText } from "../../../copy";
import { formatCurrency } from "../../../utils/numberFormatation";

import "./index.css";

import loadingIcon from 'assets/loading-circle.gif';
import awardIcon from 'assets/icons/award.png';
import medalIcon from 'assets/icons/medal.png';
import podiumIcon from 'assets/icons/podium.png';
import flagIcon from 'assets/icons/flag.png';

const views = [{ text : 10, value : 10 }, { text : 25, value : 25 }, { text : 50, value : 50 }, { text : 100, value : 100 }];
const allGames =  { text : 'All Games', value : 'all_games' };

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
    },
    biggest_win_users : {
        titles : [],
        fields : [
            {
                value : 'position'
            },
            {
                value : 'username'
            },
            {
                value : 'winAmount',
                dependentColor : true,
                condition : 'isWon'
            }
        ],
        rows : []
    },
}
  

const defaultProps = {
    all_bets    : rows.all_bets,
    my_bets     : rows.my_bets,
    biggest_win_bets : rows.biggest_win_bets,
    biggest_win_users : rows.biggest_win_users,
    view        : 'all_bets',
    view_amount : views[1],
    games : [],
    options : [],
    view_game : allGames,
    isLoading: false
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

    changeViewGames = ({option}) => {
        this.setTimer({view_game : option})
    }
    
    projectData = async (props, options=null) => {
        let { profile, ln } = props;
        let { view_amount, view_game } = this.state;
        const currencies = getApp().currencies;

        this.setState({...this.state, isLoading : true });

        let games = getGames();
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
        const copy = CopyText.homepage[ln];
        let all_bets = await getLastBets({size : view_amount.value});
        let biggest_winners_bets = await getBiggestBetWinners({size : view_amount.value});
        let biggest_win_users = await getBiggestUserWinners({size : view_amount.value});
        let my_bets = [];

        if(profile && !_.isEmpty(profile)){
            my_bets = await profile.getMyBets({size : view_amount.value});
        }
        this.setState({...this.state, 
            ...options,
            isLoading : false,
            games : gamesOptions,
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
                else if(value === "biggest_win_users"){
                    icon = podiumIcon;
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
                        username: bet.username,
                        timestamp: dateToHourAndMinute(bet.timestamp),
                        betAmount: formatCurrency(Numbers.toFloat(bet.betAmount))+' '+ticker,
                        winAmount: formatCurrency(Numbers.toFloat(bet.winAmount))+' '+ticker,
                        isWon : bet.isWon,
                        payout : `${formatCurrency(Numbers.toFloat(bet.winAmount/bet.betAmount))}x`
                    }
                }).filter( el => (view_game.value == 'all_games' || el.game.metaName == view_game.value))
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
                }).filter( el => (view_game.value == 'all_games' || el.game.metaName == view_game.value))
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
                        username: bet.username,
                        timestamp: dateToHourAndMinute(bet.timestamp),
                        betAmount: formatCurrency(Numbers.toFloat(bet.betAmount))+' '+ticker,
                        winAmount: formatCurrency(Numbers.toFloat(bet.winAmount))+' '+ticker,
                        isWon : bet.isWon,
                        payout : `${formatCurrency(Numbers.toFloat(bet.winAmount/bet.betAmount))}x`
                    }
                }).filter( el => (view_game.value == 'all_games' || el.game.metaName == view_game.value))
            },
            biggest_win_users : {
                ...this.state.biggest_win_users,
                titles : copy.TABLE.BIGGEST_WIN_USERS.ITEMS,
                rows : biggest_win_users.map( (bet, index) =>  {
                    const currenncy = (currencies.find(currency => currency._id == bet.currency));
                    const ticker = currenncy ? currenncy.ticker : "";

                    return {
                        position : `${index+1}º`,
                        username: bet._id,
                        winAmount: formatCurrency(Numbers.toFloat(bet.winAmount))+' '+ticker,
                        isWon : (index < 3),
                    }
                })
            }
        })
    }

    render() {
        const { games, isLoading } = this.state;

        return (
            <div styleName='container'>
<<<<<<< HEAD
                <div styleName='lastBets'>
                    <Tabs
                        selected={this.state.view}
                        options={this.state.options}
                        onSelect={this.handleTabChange}
                    />
                    <div styleName="filters">
                        <div styleName='bets-dropdown-game'>
                            <SelectBox
                                onChange={(e) => this.changeViewGames(e)}
                                options={games}
                                value={this.state.view_game}
                            /> 
                        </div>

                        <div styleName='bets-dropdown'>
                            <SelectBox
                                onChange={(e) => this.changeViewBets(e)}
                                options={views}
                                value={this.state.view_amount}
                            /> 
=======
                <div>
                    <div styleName="root">
                        <div styleName="container">
                            <Row>
                                <Col md={9}>
                                    <Tabs
                                        selected={this.state.view}
                                        options={this.state.options}
                                        onSelect={this.handleTabChange}
                                        spacing="60"
                                    />
                                </Col>
                                <Col md={2}>
                                    <div styleName='bets-dropdown-game'>
                                        <DropDownField
                                            id="view"
                                            type={'view'}
                                            onChange={(e) => this.changeViewGames(e)}
                                            options={views}
                                            value={this.state.view_game}
                                            style={{width : '80%'}}
                                            >
                                                <MenuItem value="all_games">
                                                    <Typography variant="body" color="casper">
                                                        {`${copy.TABLE_FILTER}`}
                                                    </Typography>
                                                </MenuItem>
                                            {games.map(option => (
                                                <MenuItem key={option} value={option.metaName}>
                                                    <Typography variant="body" color="casper">
                                                        {`${option.name}`}
                                                    </Typography>
                                                </MenuItem>
                                            ))}
                                        </DropDownField> 
                                    </div>
                                </Col>
                                <Col md={1}>
                                    <div styleName='bets-dropdown'>
                                        <DropDownField
                                            id="view"
                                            type={'view'}
                                            onChange={this.changeViewBets}
                                            options={views}
                                            value={this.state.view_amount}
                                            style={{width : '80%'}}
                                            >
                                            {views.map(option => (
                                                <MenuItem key={option} value={option}>
                                                    <Typography
                                                        variant="body"
                                                        color="casper"
                                                    >
                                                        {`${option}`}
                                                    </Typography>
                                                </MenuItem>
                                            ))}
                                        </DropDownField> 
                                    </div>
                                </Col>
                            </Row>
                        
                            <TableDefault
                                rows={this.state[this.state.view].rows}
                                titles={this.state[this.state.view].titles}
                                fields={this.state[this.state.view].fields}
                                view={this.state.view}
                            />                    
>>>>>>> 4f185013d032787e3a6203ec693dee803eed88ea
                        </div>
                    </div>
                </div>
                {isLoading 
                    ?
                        <div styleName="loading"><img src={loadingIcon} /></div>
                    :
                        <Table
                            rows={this.state[this.state.view].rows}
                            titles={this.state[this.state.view].titles}
                            fields={this.state[this.state.view].fields}
                            showRealTimeLoading={this.state.view == "all_bets" ? true : false}
                        /> 
                }
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
