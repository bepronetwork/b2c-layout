import React, { Component } from "react";
import { Typography, ActionBox } from 'components';
import { connect } from "react-redux";
import _ from 'lodash';
import "./index.css";
import WithdrawsTable from "../CashierForm/Withdraw/WithdrawsTable";
import { Numbers } from "../../lib/ethereum/lib";
import allow from 'assets/allow.png';
import { Row, Col } from 'reactstrap';
import { fromSmartContractTimeToMinutes } from "../../lib/helpers";

class WithdrawTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            withdraws : [],
            time : 0,
            dexWithdrawAvailable : 0,
            hasTokensToWithdraw : false
        };
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

   
    projectData = async (props) => {
        const { profile } = props;
        if (!profile || _.isEmpty(profile)) return true;

        let dexWithdrawAvailable =  Numbers.toFloat(await profile.getApprovedWithdrawAsync());
        let time = await profile.getTimeForWithdrawalAsync();
        let hasTokensToWithdraw = (dexWithdrawAvailable > 0) && (time <= 0);

        this.setState({...this.state, 
            time,
            hasTokensToWithdraw,
            dexWithdrawAvailable,
            ticker : profile.getAppCurrencyTicker(),    
            withdraws : profile.getWithdraws()
        })
    }
    
    withdrawTokens = async (withdrawObject) => {
        var { nonce, id, amount } = withdrawObject;
        const { profile } = this.props;
        try{
            this.setState({...this.state, onWithdraw : 'processing'});
            /* Create Withdraw */
            await profile.createWithdraw({amount : Numbers.toFloat(amount), nonce, withdraw_id : id });
            /* Update User Balance */
            await profile.getAllData();
            this.setState({...this.state, onWithdraw : 'completed'});
        }catch(err){
            console.log(err)
            await profile.getAllData();
            this.setState({...this.state, onWithdraw : null});
        }
    }

    onLoading = (key, value=true) => {
        this.setState({...this.state, [key] : value})
    }

    withdrawAll = async () => {
        try{
            this.onLoading('isWithdrawingTokens');
            const { profile } = this.props;
            const { dexWithdrawAvailable } = this.state;
            /* Create Withdraw Framework */
            let res = await profile.createWithdraw({amount : Numbers.toFloat(dexWithdrawAvailable)});
            if(!res){throw new Error("Error on Transaction")};
            this.projectData(this.props);
            this.onLoading('isWithdrawingTokens', false);
        }catch(err){
            console.log(err)
            this.onLoading('isWithdrawingTokens', false);
        }
    }

    render() {
        const { profile, ln } = this.props;
        const { time, withdraws, hasTokensToWithdraw, isWithdrawingTokens, dexWithdrawAvailable, ticker } = this.state;

        return (
            <div style={{ overflowY: 'auto', overflowX : 'hidden'}}>
                <div styleName="deposit">
                    <Row>
                        <Col lg={12}>
                            <ActionBox 
                                onClick={this.withdrawAll}
                                onLoading={isWithdrawingTokens}
                                alertMessage={`Time For Withdraw ${fromSmartContractTimeToMinutes(time)} m`} 
                                alertCondition={time > 0}
                                disabled={!hasTokensToWithdraw}
                                loadingMessage={'Metamask should prompt, click on it and Approve the Transaction'}
                                completed={!hasTokensToWithdraw} id={'withdraw-all'} image={allow} description={`Withdraw ${dexWithdrawAvailable} ${ticker}`} title={'Withdraw All Open Balances'}
                            />
                        </Col>
                    </Row>
                    <div styleName='withdraws-table'>
                        <WithdrawsTable
                            time={time}
                            ln={ln}
                            withdraw={this.withdrawTokens} 
                            currency={profile.getAppCurrencyTicker()} data={withdraws}
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

export default connect(mapStateToProps)(WithdrawTab);
