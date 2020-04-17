import React, { Component } from "react";
import { Tabs, WithdrawIcon, DepositIcon } from "components";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import { connect } from "react-redux";
import { getApp } from "../../lib/helpers";

import "./index.css";
import { CopyText } from '../../copy';

class DepositWithdrawForm extends Component {
    constructor(props) {
        super(props);
        // this.props = props;
        this.state = {
        tab: "deposit"
        };
    }

    handleTabChange = name => {
        this.setState({ tab: name });
    };

    render() {
        const { onClose } = this.props;
        const { tab } = this.state;
        const {ln} = this.props;
        const copy = CopyText.cashierFormIndex[ln];
        const virtual = getApp().virtual;

        return (
        <div styleName="root" style={{ overflowY: 'auto', overflowX : 'hidden'}}>
            <div styleName="tabs">
            <Tabs
                selected={tab}
                options={[
                {
                    value: "deposit",
                    label: virtual ? copy.INDEX.TABS.LABEL[2] : copy.INDEX.TABS.LABEL[0],
                    icon: <DepositIcon/>
                },
                {   
                    value: "withdraw", 
                    label: copy.INDEX.TABS.LABEL[1],
                    disabled: virtual,
                    icon: <WithdrawIcon/>
                }
                ]}
                onSelect={this.handleTabChange}
            />
            </div>
            {tab === "deposit" ? <Deposit onClose={onClose} /> : <Withdraw onClose={onClose}/>}
        </div>
        );
    }
}


function mapStateToProps(state){
    return {
        profile : state.profile,
        ln: state.language
    };
}


export default connect(mapStateToProps)(DepositWithdrawForm);