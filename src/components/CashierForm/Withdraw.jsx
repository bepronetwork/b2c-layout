import React, { Component } from "react";
// eslint-disable-next-line import/no-cycle
import "./index.css";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import { 
    HorizontalStepper, AmountWithdrawForm, CurrencyWithdrawForm, 
    WithdrawForm
} from 'components';
import _ from 'lodash';

const defaultProps = {
    amount : 1,
    ticker : 'N/A',
    deposits : [],
    mounted : false
}

class Withdraw extends Component {

    state = { ...defaultProps };

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }
    
    async projectData(props){
        const { profile, withdraw } = props;
        const { currency } = withdraw;
        let userBalance = profile.getBalance(currency);
        this.setState({...this.state, userBalance});
    }

    closeDeposit = () => {
        const { onClose } = this.props;
        onClose();
    }

    render() {
        const { withdraw } = this.props;
        const { userBalance } = this.state;
        const { currency, nextStep, amount, tx, _id, toAddress } = withdraw;

        return (
            <div styleName='root'>
                 <div styleName="deposit">
                    <div styleName="title">
                        <HorizontalStepper 
                            showStepper={false}
                            nextStep={nextStep}
                            steps={[
                                {
                                    label : "Choose",
                                    title : 'Choose the Currency you want to withdraw to',
                                    condition : (!_.isEmpty(currency)),
                                    content : <CurrencyWithdrawForm/>
                                },
                                {
                                    label : "Amount",
                                    title : 'How much you want to withdraw?',
                                    condition : ( (amount >= 0.0001)  && (amount <= parseFloat(userBalance) && toAddress) ),
                                    nextButtonLabel : "Submit",
                                    content : <AmountWithdrawForm/>
                                },
                                {
                                    label : "Withdraw",
                                    title : 'Withdraw',
                                    condition : (_id && (_id != ('' || null))),
                                    content : <WithdrawForm closeStepper={this.closeDeposit}/>,
                                    last : true,
                                    showCloseButton : false,
                                    closeStepper : this.closeDeposit
                                }
                            ]}
                        />
                    </div>
               </div>
            </div>
        );
    }
}



function mapStateToProps(state){
    return {
        withdraw : state.withdraw,
        profile : state.profile,
        ln : state.language
    };
}

export default compose(connect(mapStateToProps))(Withdraw);
