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
import { CopyText } from "../../copy";
import { setDepositOrWithdrawResult } from "../../redux/actions/depositOrWithdraw";
import { setMessageNotification } from "../../redux/actions/message";
import store from "../../containers/App/store";

const defaultProps = {
    amount : 10,
    ticker : 'DAI',
    time : 0,
    totalAmount : 0,
    withdrawAvailable : 0,
    withdraws : []
}

class WithdrawTODO extends Component {
    static contextType = UserContext;

    state = { ...defaultProps };

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        let user = this.props.profile;
        let decentralizeWithdrawAmount = user.getApprovedWithdraw();
        let time = user.getTimeForWithdrawalAsync();
        //let timestampWithdraw = await user.casinoContract.getApprovedWithdrawTimeStamp(await user.getMetamaskAddress());
        //var timestamp = (await window.web3.eth.getBlock("latest")).timestamp;
        //let limitWithdraw = parseInt(await user.casinoContract.getWithdrawalTimeRelease());
        //let isPaused = await user.casinoContract.isPaused();
        //let maxWithdrawal = await user.casinoContract.getMaxWithdrawal();
        if (!user || _.isEmpty(user)) return true;

        this.setState({...this.state, 
            time,
            totalAmount : Numbers.toFloat(user.getBalance()),
            withdrawAvailable : Numbers.toFloat(decentralizeWithdrawAmount),
            ticker : 'DAI',    
            withdraws : user.getWithdraws()
        })
    }
    
    askForWithdraw = async () => {
        /*Check Withdrawal does not exceed limit */
        const { ln } = this.props;
        const copy = CopyText.Deposit;
        let max = await this.context.user.getMaxWithdrawal();
        if(this.state.amount >= max) {
            return await store.dispatch(setMessageNotification(`${copy[ln].ERROR.SECOND} ${Math.round(max)} ${this.state.ticker}`))
        }

        const user = this.props.profile;
        try{
            this.setState({...this.state, onWithdraw : 'processing'});
            /* Create Withdraw */
            let res = await user.askForWithdraw({amount : Numbers.toFloat(this.state.amount)});
            this.setState({...this.state, nonce : res.nonce});
            /* Update User Balance */
            await user.getAllData();
            this.projectData(this.props);
            this.setState({...this.state, onWithdraw : null});
        }catch(err){
            console.log(err)
            await user.getAllData();
            this.projectData(this.props);
            this.setState({...this.state, onWithdraw : null});
        }
    }

    withdrawTokens = async (withdrawObject) => {
        var { nonce, id, amount } = withdrawObject;
        const user = this.props.profile;
        try{
            this.setState({...this.state, onWithdraw : 'processing'});
            /* Create Withdraw */
            await user.createWithdraw({amount : Numbers.toFloat(amount), nonce, withdraw_id : id });
            /* Update User Balance */
            await user.getAllData();
            this.setState({...this.state, onWithdraw : 'completed'});
        }catch(err){
            console.log(err)
            await user.getAllData();
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
            this.projectData(this.props);
            this.setState({...this.state, onWithdraw : null});
        }
    }


    render() {
        const { permission, processing, onWithdraw, amount, time } = this.state;
        const { ln } = this.props;
        const COPY = CopyText.Withdraw[ln];

        return (
                <Row>
                    <Col lg={12}>
                        <div styleName="deposit">
                            <div styleName="title">
                                <Typography variant="body" color="white">
                                   {COPY.TITLE.FIRST} <strong style={{color : 'green'}}>{this.state.totalAmount} {this.state.ticker}</strong> {COPY.TITLE.SECOND}
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
                                        
                                            <Typography>{COPY.BUTTON_ONE}</Typography>
                                        </Button>

                                      
                                    </div>
                                ) : null}
                                {onWithdraw === ("processing") ? 
                                    <div>
                                        <Typography color="white" variant="body">
                                           {COPY.INFO.FIRST}<br></br> 
                                           {COPY.INFO.SECOND}
                                        </Typography>
                                        <div style={{marginTop : 30}}>
                                            <Loader />
                                        </div>
                                    </div>
                            : null}
                                {onWithdraw === "completed" ? (
                                    <Typography color="green" variant="body">
                                           {COPY.INFO.THIRD}
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
                                    {COPY.INFO.FORTH}
                                    <strong style={{color : 'green'}}>{this.state.withdrawAvailable} {this.state.ticker}</strong> 
                                    {COPY.INFO.FIFTH}
                                </Typography>
                                <Typography variant="small-body" color="casper" otherStyles={{textAlign : 'center', marginBottom : 10}}>
                                    {COPY.INFO.SIXTH}
                                </Typography>
                                <WithdrawsTable
                                    time={time}
                                    ln={this.props.ln}
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
        ln : state.language
    };
}

export default compose(connect(mapStateToProps))(WithdrawTODO);
