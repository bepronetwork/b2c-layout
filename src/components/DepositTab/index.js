import React, { Component } from "react";
import { Typography } from 'components';
import { connect } from "react-redux";

import "./index.css";
import DepositsTable from "../CashierForm/Deposit/DepositsTable";

class DepositTab extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {

    }

    confirmDeposit = async (deposit) => {
        try{
            const { profile } = this.props;
            /* Create Deposit Framework */
            let res = await profile.confirmDeposit(deposit);
            let { message, status } = res.data;
            if(status != 200){throw message};
            /* Update user Data */
            await profile.getAllData();            
        }catch(err){
            console.log(err)
        }
    }

    render() {
        const { profile, ln } = this.props;
        const id = profile.getID();

        return (
            <div style={{ overflowY: 'auto', overflowX : 'hidden'}}>
                <div styleName="deposit">
                    <div styleName='withdraws-table'>
                        <DepositsTable
                            profile={profile}
                            ln={ln}
                            confirmDeposit={this.confirmDeposit} 
                            currency={profile.getAppCurrencyTicker()}
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

export default connect(mapStateToProps)(DepositTab);
