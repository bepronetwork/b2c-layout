import React, { Component } from "react";
import { Tabs, Modal } from "components";
import Withdraw from "./Withdraw";
import { connect } from "react-redux";

import "./index.css";
import store from "../../containers/App/store";
import { setModal } from "../../redux/actions/modal";

class AffiliateWithdrawForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tab: "withdraw"
        };
    }

    handleTabChange = name => {
        this.setState({ tab: name });
    };

    onClose = async () => {
        await store.dispatch(setModal({key : 'AffiliateWithdrawForm', value : false}));
    }

    render() {
        const { modal } = this.props;
        const { tab } = this.state;
        if(!modal.AffiliateWithdrawForm){ return null };

        return (
            <Modal onClose={this.onClose}>
                <div styleName="root" style={{ overflowY: 'auto', overflowX : 'hidden'}}>
                    <div styleName="tabs">
                    <Tabs
                        selected={tab}
                        options={[
                        { value: "withdraw", label: "Withdraw" }
                        ]}
                        onSelect={this.handleTabChange}
                    />
                    </div>
                        <Withdraw onClose={this.onClose}/>
                </div>
            </Modal>
        );
    }
}


function mapStateToProps(state){
    return {
        profile : state.profile,
        modal : state.modal
    };
}

export default connect(mapStateToProps)(AffiliateWithdrawForm);