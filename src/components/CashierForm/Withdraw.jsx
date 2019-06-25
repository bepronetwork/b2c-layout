import React, { Component } from "react";
// eslint-disable-next-line import/no-cycle
import { Typography, Button, InputNumber } from "components";
import UserContext from "containers/App/UserContext";
import Loader from "./Loader";
import { updateUserBalance, getCurrentUser } from 'lib/api/users';
import { Col, Row } from 'reactstrap';

import "./index.css";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import _ from 'lodash';
import "./index.css";
import { Numbers } from "../../lib/ethereum/lib";
import { processResponse } from "../../lib/api/apiConfig";
import WithdrawsTable from "./Withdraw/WithdrawsTable";

const defaultProps = {
    amount : 10,
    ticker : 'DAI',
    totalAmount : 0,
    withdrawAvailable : 0,
    withdraws : []
}

class Withdraw extends Component {
    static contextType = UserContext;

    state = { ...defaultProps };

    componentDidMount(){
        this.projectData(this.props);
        this.setTimer();
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }
    
    projectData = async (props) => {
        let decentralizeWithdrawAmount = await props.profile.getApprovedWithdraw();
        let user = await getCurrentUser();
        this.setState({...this.state, 
            totalAmount : Numbers.toFloat(user.balance),
            withdrawAvailable : Numbers.toFloat(decentralizeWithdrawAmount),
            ticker : 'DAI',    
            withdraws : props.profile.getWithdraws()
        })
    }

    setTimer = () => {
        clearTimeout(this.timer);
        this.timer = setInterval(
            async () => {
            await this.props.profile.updateUser();
            this.projectData(this.props);
        }, 1000);
    }

    askForWithdraw = async () => {
        const { user, setUser } = this.context;
        try{
            this.setState({...this.state, onWithdraw : 'processing'});
            /* Create Withdraw */
            let res = await user.askForWithdraw({amount : Numbers.toFloat(this.state.amount)});
            this.setState({...this.state, nonce : res.nonce});
            /* Update User Balance */
            await updateUserBalance(user, setUser);
            this.setState({...this.state, onWithdraw : null});
        }catch(err){
            console.log(err)
            await updateUserBalance(user, setUser);
            this.projectData(this.props);
            this.setState({...this.state, onWithdraw : null});
        }
    }

    withdrawTokens = async (withdrawObject) => {
        var { nonce, id, amount } = withdrawObject;
        const { user, setUser } = this.context;
        try{
            this.setState({...this.state, onWithdraw : 'processing'});
            /* Create Withdraw */
            await user.createWithdraw({amount : Numbers.toFloat(amount), nonce, withdraw_id : id });
            /* Update User Balance */
            await updateUserBalance(user, setUser);
            this.setState({...this.state, onWithdraw : 'completed'});
        }catch(err){
            console.log(err)
            await updateUserBalance(user, setUser);
            this.setState({...this.state, onWithdraw : null});
        }
    }

    cancelWithdraw = async () => {
        const { user, setUser } = this.context;
        try{
            this.setState({...this.state, onWithdraw : 'processing'});
            /* Create Withdraw */
            await user.cancelWithdrawals();
            /* Update User Balance */
            this.setState({...this.state, onWithdraw : null});
        }catch(err){
            await updateUserBalance(user, setUser);
            this.projectData(this.props);
            this.setState({...this.state, onWithdraw : null});
        }
    }


    render() {
        const { permission, processing, onWithdraw, amount } = this.state;

        return (
                <Row>
                    <Col lg={12}>
                        <div styleName="deposit">
                            <div styleName="title">
                                <Typography variant="body" color="white">
                                    You have <strong style={{color : 'green'}}>{this.state.totalAmount} {this.state.ticker}</strong> Tokens
                                </Typography>
                            </div>
                            <div styleName="button">
                                {!onWithdraw ? (
                                    <div>
                                        <div styleName='input-box'>
                                            <InputNumber
                                                name="amount"
                                                min={0.01}
                                                max={1000}
                                                precision={2}
                                                title="Withdraw Amount"
                                                onChange={(amount) => this.setState({...this.state, amount : amount})}
                                                icon="cross"
                                                value={this.state.amount}
                                            />
                                        </div>
                                        <Button
                                            disabled={amount <= 0 || onWithdraw || this.state.totalAmount < this.state.amount}
                                            name="withdraw"
                                            theme="primary"
                                            variant="small-body"
                                            onClick={this.askForWithdraw}
                                        >
                                        
                                            <Typography>Ask for Withdraw</Typography>
                                        </Button>

                                      
                                    </div>
                                ) : null}
                                {onWithdraw === ("processing") ? 
                                    <div>
                                        <Typography color="white" variant="body">
                                            Don´t close the Window 🤗<br></br> Please Wait..
                                        </Typography>
                                        <div style={{marginTop : 30}}>
                                            <Loader />
                                        </div>
                                    </div>
                            : null}
                                {onWithdraw === "completed" ? (
                                    <Typography color="green" variant="body">
                                        Withdraw Succeeded
                                    </Typography>
                                ) : null}
                            </div>
                        </div>
                    </Col>
                     {/*<Col lg={6}>
                        <div styleName="title">
                            <Typography variant="body" color="white" otherStyles={{textAlign : 'left'}}>
                                You have <strong style={{color : 'green'}}>{this.state.withdrawAvailable} {this.state.ticker}</strong> Tokens Available to Withdraw
                            </Typography>
                        </div>
                        <div styleName="button">
                            {!onWithdraw ? (
                                <div>
                                    
                                    <Button
                                        disabled={this.state.withdrawAvailable == 0}
                                        name="deposit"
                                        theme="primary"
                                        variant="medium-body"
                                        onClick={this.withdrawTokens}
                                    >
                                        <Typography>Withdraw</Typography>
                                    </Button>
                                    <div style={{marginTop : 40}}>
                                        <Button
                                            name="withdraw"
                                            theme="default"
                                            variant="small-body"
                                            onClick={this.cancelWithdraw}
                                        >
                                        
                                            <Typography>Cancel Withdraw</Typography>
                                        </Button>
                                    </div>
                                    
                                </div>
                            ) : null}
                            {onWithdraw === ("processing") ? 
                                <div>
                                    <Typography color="white" variant="body">
                                        Don´t close the Window 🤗<br></br> Please Wait..
                                    </Typography>
                                    <div style={{marginTop : 30}}>
                                        <Loader />
                                    </div>
                                </div>
                        : null}
                            {onWithdraw === "completed" ? (
                                <Typography color="green" variant="body">
                                    Withdraw Succeeded
                                </Typography>
                            ) : null}
                        </div>
                            </Col>*/}
                    <Col lg={12}>
                        <div styleName="deposit">
                            <div styleName='withdraws-table'>
                                <Typography variant="body" color="white" otherStyles={{textAlign : 'center', marginBottom : 10}}>
                                    You have <strong style={{color : 'green'}}>{this.state.withdrawAvailable} {this.state.ticker}</strong> Tokens Available to Withdraw
                                </Typography>
                                <WithdrawsTable
                                    withdraw={this.withdrawTokens} 
                                    currency={this.props.profile.getAppCurrencyTicker()} data={this.state.withdraws}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
        );
    }
}


function mapStateToProps(state){
    return {
        profile: state.profile,
    };
}

export default compose(connect(mapStateToProps))(Withdraw);
