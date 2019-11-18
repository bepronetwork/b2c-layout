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

        let time = await profile.getTimeForWithdrawalAsync();

        this.setState({...this.state, 
            time,
            ticker : profile.getAppCurrencyTicker(),    
            withdraws : profile.getWithdraws()
        })
    }

    onLoading = (key, value=true) => {
        this.setState({...this.state, [key] : value})
    }

    render() {
        const { profile, ln } = this.props;
        const { time, withdraws, ticker } = this.state;

        return (
            <div style={{ overflowY: 'auto', overflowX : 'hidden'}}>
                <div styleName="deposit">
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
