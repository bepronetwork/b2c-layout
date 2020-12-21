import React, { Component } from "react";
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

export default WithdrawForm;
