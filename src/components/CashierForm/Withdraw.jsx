import React, { Component } from "react";
// eslint-disable-next-line import/no-cycle
import "./index.css";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import { 
    HorizontalStepper, AmountWithdrawForm, CurrencyWithdrawForm, 
    WithdrawForm
} from 'components';
import store from '../../containers/App/store';
import { setMessageNotification } from '../../redux/actions/message';
import _ from 'lodash';
import { CopyText } from '../../copy';

const defaultProps = {
    amount : 1,
    ticker : 'N/A',
    deposits : [],
    mounted : false
}

class Withdraw extends Component {

    state = { ...defaultProps };

    componentDidMount(){
        const { ln, profile} = this.props;
        const copy = CopyText.homepage[ln];

        this.projectData(this.props);

        if(!_.isEmpty(profile) && !profile.user.email_confirmed){
            store.dispatch(setMessageNotification(copy.CONTAINERS.APP.NOTIFICATION[0]));
        }
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
        const {ln} = this.props;
        const copy = CopyText.cashierFormWithdraw[ln];

        return (
            <div styleName='root'>
                 <div styleName="deposit">
                    <div styleName="title">
                        <HorizontalStepper 
                            showStepper={false}
                            nextStep={nextStep}
                            steps={[
                                {
                                    label : copy.WITHDRAW.HORIZONTAL_STEPPER.LABEL[0],
                                    title : copy.WITHDRAW.HORIZONTAL_STEPPER.TITLE[0],
                                    condition : (!_.isEmpty(currency)),
                                    content : <CurrencyWithdrawForm/>
                                },
                                {
                                    label : copy.WITHDRAW.HORIZONTAL_STEPPER.LABEL[1],
                                    title : copy.WITHDRAW.HORIZONTAL_STEPPER.TITLE[1],
                                    condition : ( (amount >= 0.0001)  && (amount <= parseFloat(userBalance) && toAddress) ),
                                    nextButtonLabel : copy.WITHDRAW.HORIZONTAL_STEPPER.BUTTON_LABEL[0],
                                    content : <AmountWithdrawForm/>
                                },
                                {
                                    label : copy.WITHDRAW.HORIZONTAL_STEPPER.LABEL[2],
                                    title : copy.WITHDRAW.HORIZONTAL_STEPPER.TITLE[2],
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
