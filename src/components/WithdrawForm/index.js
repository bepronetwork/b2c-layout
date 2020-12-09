import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import { HorizontalStepper} from 'components';
import Form from "./Form"
import "./index.css";

class WithdrawForm extends Component {

    constructor(props){
        super(props);
    }

    render() {
        const {isAffiliate, wallet, onAddress} = this.props;

        return (
                <HorizontalStepper showStepper={false} 
                    steps={[
                        {
                            label : "Withdraw",
                            content : <Form isAffiliate={isAffiliate} wallet={wallet} onAddress={onAddress}/>,
                            last : true,
                            showCloseButton : false,
                            showBackButton : false
                        }
                    ]}
                />
        );
    }
}


function mapStateToProps(state){
    return {
        profile : state.profile,
        ln : state.language
    };
}

export default compose(connect(mapStateToProps))(WithdrawForm);
