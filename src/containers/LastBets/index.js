import React, { Component } from "react";
import {Typography } from "components";
import PropTypes from "prop-types";
import UserContext from "containers/App/UserContext";

import "./index.css";
import { getLastBets } from "../../lib/api/app";
import { Numbers } from "../../lib/ethereum/lib";
import { dateToHourAndMinute } from "../../lib/helpers";

const title = [
    'Game',
    'Bet ID',
    'User',
    'Time',
    'Bet',
    'Payout',
    'Profit'
]

const bets = [
    {
        game : 234,
        bet_id : 234,
        user : 'regwegr',
        time : 234,
        bet : 2,
        payout : 2,
        profit : 20
    },
    {
        game : 234,
        bet_id : 234,
        user : 'regwegr',
        time : 234,
        bet : 2,
        payout : 2,
        profit : 20
    }
]
function isOdd(num) { return num % 2;}


const defaultProps = {
    bets : []
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
        this.setTimer();
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    setTimer = () => {
        this.timer = setInterval( () => {
            this.projectData()
        }, 1*1000)
    }
    
    projectData = async (props) => {
        let bets = await getLastBets();
        console.log(bets);
        this.setState({...this.state, 
            bets : bets.map( (bet) =>  {
                return {
                    game: bet.game,
                    id: new String(bet._id).slice(3, 15),
                    username: bet.username,
                    timestamp: dateToHourAndMinute(bet.timestamp),
                    betAmount: Numbers.toFloat(bet.betAmount),
                    winAmount: Numbers.toFloat(bet.winAmount),
                    isWon : bet.isWon,
                    payout : `${Numbers.toFloat(bet.winAmount/bet.betAmount)}x`
                }
            })
        })
    }

    render() {
        return (
            <div styleName="last-bets-container">
                <div styleName="root">
                    <div styleName="container">
                        <table styleName='table-row'>
                            <thead styleName='table-head'>
                                <tr styleName='tr-row'>
                                    {title.map( text => 
                                        <th styleName='th-row'>
                                            <Typography variant='small-body' color="white"> {text} </Typography>
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.bets.map( (bet, index) => 
                                    <tr styleName={isOdd(index) ? 'tr-row' : 'tr-row-odd'}>
                                        <th styleName='th-row'>
                                            <Typography variant='small-body' color={"white"}> {bet.game} </Typography>
                                        </th>
                                        <th styleName='th-row'>
                                            <Typography variant='small-body' color={"white"}> {bet.id} </Typography>
                                        </th>
                                        <th styleName='th-row'>
                                            <Typography variant='small-body' color={"white"}> {bet.username} </Typography>
                                        </th>
                                        <th styleName='th-row'>
                                            <Typography variant='small-body' color={"white"}> {bet.timestamp} </Typography>
                                        </th>
                                        <th styleName='th-row'>
                                            <Typography variant='small-body' color={"white"}> {bet.betAmount} </Typography>
                                        </th>
                                    
                                        <th styleName='th-row'>
                                            <Typography variant='small-body' color={ bet.isWon ? 'green' : "grey"}> {bet.payout} </Typography>
                                        </th>
                                        <th styleName='th-row'>
                                            <Typography variant='small-body' color={ bet.isWon ? 'green' : "grey"}>{bet.winAmount} 
                                            </Typography>
                                        </th>
                                    </tr>
                                    )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}



export default LastBets;