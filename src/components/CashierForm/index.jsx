import React, { Component } from "react";
import { Tabs } from "components";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";

import "./index.css";

export default class DepositWithdrawForm extends Component {
    constructor(props) {
        super(props);

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

        return (
        <div styleName="root" style={{ overflowY: 'auto', overflowX : 'hidden'}}>
            <div styleName="tabs">
            <Tabs
                selected={tab}
                options={[
                {
                    value: "deposit",
                    label: "Deposit"
                },
                { value: "withdraw", label: "Withdraw" }
                ]}
                onSelect={this.handleTabChange}
            />
            </div>
            {tab === "deposit" ? <Deposit onClose={onClose} /> : <Withdraw onClose={onClose}/>}
        </div>
        );
    }
}
