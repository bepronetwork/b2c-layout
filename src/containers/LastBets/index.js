import React, { Component } from "react";
import PropTypes from "prop-types";
import UserContext from "containers/App/UserContext";
import { connect } from "react-redux";
import { Row, Col } from 'reactstrap';
import "./index.css";
import { getLastBets } from "../../lib/api/app";
import { Numbers } from "../../lib/ethereum/lib";
import { dateToHourAndMinute } from "../../lib/helpers";
import Tabs from "../../components/Tabs";
import { DropDownField, Typography } from 'components';
import TableDefault from "./Table";
import { MenuItem } from '@material-ui/core';
import _ from 'lodash';
import { CopyText } from "../../copy";

const views = [10 , 25, 50, 100];

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
    view        : 'all_bets',
    view_amount : views[1],
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

    changeViewBets = ({value}) => {
        this.setState({...this.state, view_amount : value});
    }
    
    projectData = async (props) => {
        let { profile, ln } = props;
        let { view_amount } = this.state;
        const copy = CopyText.homepage[ln];
        let all_bets = await getLastBets({size : view_amount});
        let my_bets = [];

        if(profile && !_.isEmpty(profile)){
            my_bets = await profile.getMyBets({size : view_amount});
        }

        this.setState({...this.state, 
            all_bets : {
                ...this.state.all_bets,
                titles : copy.TABLE.ALL_BETS,
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
                titles : copy.TABLE.MY_BETS,
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
                        <Row>
                            <Col md={11}>
                                <Tabs
                                    selected={this.state.view}
                                    options={options}
                                    onSelect={this.handleTabChange}
                                />
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
