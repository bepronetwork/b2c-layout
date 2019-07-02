import React, { Component } from "react";
import PropTypes from "prop-types";
import UserContext from "containers/App/UserContext";
import { connect } from "react-redux";

import "./index.css";
import { getLastBets } from "../../lib/api/app";
import { Numbers } from "../../lib/ethereum/lib";
import { dateToHourAndMinute } from "../../lib/helpers";
import Tabs from "../../components/Tabs";
import TableDefault from "./Table";

const rows = {
    all_bets : {
        titles : [
            'Game',
            'Bet ID',
            'User',
            'Time',
            'Bet',
            'Payout',
            'Profit'
        ],
        fields : [
            {
                value : 'game'
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
        titles : [
            'Game',
            'Bet ID',
            'Time',
            'Bet',
            'Payout',
            'Profit'
        ],
        fields : [
            {
                value : 'game'
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
    }
}
  


const options = [
    {
      value: "all_bets",
      label: "All Bets"
    },
    { value: "my_bets", label: "My Bets" }
  ];
  

const defaultProps = {
    all_bets    : rows.all_bets,
    my_bets     : rows.my_bets,
    view        : 'all_bets'
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
            this.projectData(this.props)
        }, 1*1000)
    }

    handleTabChange = name => {
        this.setState({...this.state, view : name})
    };
    
    projectData = async (props) => {
        let { profile } = props;

        let all_bets = await getLastBets();
        let my_bets = await profile.getMyBets({size : 15});

        this.setState({...this.state, 
            all_bets : {
                ...this.state.all_bets,
                rows : all_bets.map( (bet) =>  {
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
            },
            my_bets : {
                ...this.state.my_bets,
                rows : my_bets.map( (bet) =>  {
                    return {
                        game: bet.game,
                        id: new String(bet._id).slice(3, 15),
                        timestamp: dateToHourAndMinute(bet.timestamp),
                        betAmount: Numbers.toFloat(bet.betAmount),
                        winAmount: Numbers.toFloat(bet.winAmount),
                        isWon : bet.isWon,
                        payout : `${Numbers.toFloat(bet.winAmount/bet.betAmount)}x`
                    }
                })
            }
        })
    }

    render() {
        return (
            <div styleName="last-bets-container">
                <div styleName="root">
                     <div styleName="container">
                        <Tabs
                            selected={this.state.view}
                            options={options}
                            onSelect={this.handleTabChange}
                        />
                        <TableDefault
                            rows={this.state[this.state.view].rows}
                            titles={this.state[this.state.view].titles}
                            fields={this.state[this.state.view].fields}
                        />                    
                    </div>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state){
    return {
        profile: state.profile,
    };
}

export default connect(mapStateToProps)(LastBets);
