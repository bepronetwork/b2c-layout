import React, { Component } from "react";
import "./index.css";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import { 
    HorizontalStepper, AmountWithdrawForm, CurrencyWithdrawForm, 
    WithdrawForm
} from 'components';
import store from "../../containers/App/store";
import { setWithdrawInfo } from "../../redux/actions/withdraw";
import { CopyText } from '../../copy';

const defaultProps = {
    amount : 10,
    ticker : 'DAI',
    isAddressValid : true,
    deposits : [],
    ownedDAI : 0,
    isValidAddress : true,
    mounted : false
}

class Withdraw extends Component {

    state = { ...defaultProps };

    componentDidMount(){
        const { profile } = this.props;
        const { wallet : userBalance } = profile.getAffiliateInfo();
        store.dispatch(setWithdrawInfo({key : "amount", value : parseFloat(userBalance)}));
        store.dispatch(setWithdrawInfo({key : "isAffiliate", value : true}));
        this.projectData(this.props)
    }
 
    UNSAFE_componentWillReceiveProps(props){
        this.projectData(props);
    }
    
    async projectData(props){
        const { profile } = props;
        const { wallet : userBalance } = profile.getAffiliateInfo();
        
        this.setState({
            userBalance: userBalance ? userBalance.playBalance : null
        });
    }

    closeDeposit = () => {
        const { onClose } = this.props;
        onClose();
    }

    render() {
        const { withdraw } = this.props;
        const { userBalance } = this.state;
        const { currency, nextStep, amount, _id, toAddress } = withdraw;
        const {ln} = this.props;
        const copy = CopyText.affiliateWithdrawFormWithdraw[ln];

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
                                    condition : (currency != ''),
                                    content : <CurrencyWithdrawForm/>
                                },
                                {
                                    label : copy.WITHDRAW.HORIZONTAL_STEPPER.LABEL[1],
                                    title : copy.WITHDRAW.HORIZONTAL_STEPPER.TITLE[1],
                                    condition : ( (amount >= 0.0001)  && (amount <= parseFloat(userBalance) && toAddress) ),
                                    nextButtonLabel : "Submit",
                                    content : <AmountWithdrawForm/>
                                },
                                {
                                    label : copy.WITHDRAW.HORIZONTAL_STEPPER.LABEL[1],
                                    title : copy.WITHDRAW.HORIZONTAL_STEPPER.TITLE[1],
                                    condition : (_id && (_id != ('' || null))),
                                    content : <WithdrawForm/>,
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
