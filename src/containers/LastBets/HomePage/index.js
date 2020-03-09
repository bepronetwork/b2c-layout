import React, { Component } from "react";
import PropTypes from "prop-types";
import UserContext from "containers/App/UserContext";
import { connect } from "react-redux";
import { Row, Col } from 'reactstrap';
import "./index.css";
import { getLastBets, getBiggestUserWinners, getBiggestBetWinners } from "../../../lib/api/app";
import { Numbers } from "../../../lib/ethereum/lib";
import { dateToHourAndMinute, getGames } from "../../../lib/helpers";
import Tabs from "../../../components/Tabs";
import { DropDownField, Typography } from 'components';
import TableDefault from "./Table";
import { MenuItem } from '@material-ui/core';
import _ from 'lodash';
import { CopyText } from "../../../copy";
import { formatCurrency } from "../../../utils/numberFormatation";

const views = [10 , 25, 50, 100];

const rows = {
    all_bets : {
        titles : [],
        fields : [
            {
                value : 'game',
                image : true,
            },
            {
                value : 'id'
            },
            {
                value : 'username'
            },
            {
                value : 'timestamp'
            },
            {
                value : 'betAmount'
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
                value : 'id'
            },
            {
                value : 'timestamp'
            },
            {
                value : 'betAmount'
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
                value : 'id'
            },
            {
                value : 'username'
            },
            {
                value : 'timestamp'
            },
            {
                value : 'betAmount'
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
    view_game : 'all_games'
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

    changeViewBets = ({value}) => {
        this.setTimer({view_amount : value})
    }

    changeViewGames = ({value}) => {
        this.setTimer({view_game : value})
    }
    
    projectData = async (props, options=null) => {
        let { profile, ln } = props;
        let { view_amount, view_game } = this.state;
        const games = getGames();
        
        if(options){
            view_amount = options.view_amount ? options.view_amount : view_amount;
            view_game = options.view_game ? options.view_game : view_game;
        }
        const copy = CopyText.homepage[ln];
        let all_bets = await getLastBets({size : view_amount});
        let biggest_winners_bets = await getBiggestBetWinners({size : view_amount});
        let biggest_win_users = await getBiggestUserWinners({size : view_amount});
        let my_bets = [];

        if(profile && !_.isEmpty(profile)){
            my_bets = await profile.getMyBets({size : view_amount});
        }
        this.setState({...this.state, 
            ...options,
            games : games,
            options : Object.keys(copy.TABLE).map( (key) => {
                return {
                    value : new String(key).toLowerCase(),
                    label : copy.TABLE[key].TITLE,
                }
            }),
            all_bets : {
                ...this.state.all_bets,
                titles : copy.TABLE.ALL_BETS.ITEMS,
                rows : all_bets.map( (bet) =>  {
                    return {
                        game: (games.find(game => new String(game.name).toLowerCase() == new String(bet.game).toLowerCase())),
                        id: new String(bet._id).slice(3, 15),
                        username: bet.username,
                        timestamp: dateToHourAndMinute(bet.timestamp),
                        betAmount: formatCurrency(Numbers.toFloat(bet.betAmount)),
                        winAmount: formatCurrency(Numbers.toFloat(bet.winAmount)),
                        isWon : bet.isWon,
                        payout : `${formatCurrency(Numbers.toFloat(bet.winAmount/bet.betAmount))}x`
                    }
                }).filter( el => (view_game == 'all_games' || el.game.metaName == view_game))
            },
            my_bets : {
                ...this.state.my_bets,
                titles : copy.TABLE.MY_BETS.ITEMS,
                rows : my_bets.map( (bet) =>  {
                    return {
                        game: (games.find(game => new String(game.name).toLowerCase() == new String(bet.game).toLowerCase())),
                        id: new String(bet._id).slice(3, 15),
                        timestamp: dateToHourAndMinute(bet.timestamp),
                        betAmount: formatCurrency(Numbers.toFloat(bet.betAmount)),
                        winAmount: formatCurrency(Numbers.toFloat(bet.winAmount)),
                        isWon : bet.isWon,
                        payout : `${formatCurrency(Numbers.toFloat(bet.winAmount/bet.betAmount))}x`
                    }
                }).filter( el => (view_game == 'all_games' || el.game.metaName == view_game))
            },
            biggest_win_bets  : {
                ...this.state.biggest_win_bets,
                titles : copy.TABLE.BIGGEST_WIN_BETS.ITEMS,
                rows : biggest_winners_bets.map( (bet) =>  {
                    return {
                        game: (games.find(game => new String(game.name).toLowerCase() == new String(bet.game).toLowerCase())),
                        id: new String(bet._id).slice(3, 15),
                        username: bet.username,
                        timestamp: dateToHourAndMinute(bet.timestamp),
                        betAmount: formatCurrency(Numbers.toFloat(bet.betAmount)),
                        winAmount: formatCurrency(Numbers.toFloat(bet.winAmount)),
                        isWon : bet.isWon,
                        payout : `${formatCurrency(Numbers.toFloat(bet.winAmount/bet.betAmount))}x`
                    }
                }).filter( el => (view_game == 'all_games' || el.game.metaName == view_game))
            },
            biggest_win_users : {
                ...this.state.biggest_win_users,
                titles : copy.TABLE.BIGGEST_WIN_USERS.ITEMS,
                rows : biggest_win_users.map( (bet, index) =>  {
                    return {
                        position : `${index+1}º`,
                        username: bet._id,
                        winAmount: formatCurrency(Numbers.toFloat(bet.winAmount)),
                        isWon : (index < 3),
                    }
                })
            }
        })
    }

    render() {
        const { ln } = this.props;
        const { games } = this.state;
        const copy = CopyText.homepage[ln];

        return (
            <div styleName='container'>
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
                            />                    
                        </div>
                    </div>
                </div>
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
