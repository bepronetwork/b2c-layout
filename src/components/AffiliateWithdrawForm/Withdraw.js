import React, { Component } from "react";
// eslint-disable-next-line import/no-cycle
import "./index.css";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import { 
    HorizontalStepper, AmountWithdrawForm, CurrencyWithdrawForm, 
    WithdrawForm
} from 'components';
import { MIN_WITHDRAWAL } from "../../lib/api/apiConfig";
import { Numbers } from 'lib/ethereum/lib';
import store from "../../containers/App/store";
import { setWithdrawInfo } from "../../redux/actions/withdraw";
<<<<<<< HEAD
import { CopyText } from '../../copy';
=======
import {CopyText} from '../../copy'

>>>>>>> d4401dd52d36b5369975f2fc89cb4e032a134ed4

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
        /* Set Affiliate */
        const { profile } = this.props;
        const { wallet : userBalance } = profile.getAffiliateInfo();
        store.dispatch(setWithdrawInfo({key : "amount", value : parseFloat(userBalance)}));
        store.dispatch(setWithdrawInfo({key : "isAffiliate", value : true}));
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }
    
    async projectData(props){
        const { profile } = props;
        try{
            let allowedAmount = await profile.getApprovedWithdrawAsync();
            const { wallet : userBalance } = profile.getAffiliateInfo();
            let ownedDAI = parseFloat(await profile.getTokenAmount());
            let maxWithdrawal = await profile.getContract().getMaxWithdrawal();  

            this.setState({...this.state, ownedDAI, userBalance, maxWithdrawal, allowedAmount});
        }catch(err){
            this.setState({...this.state})
        }
    }

    closeDeposit = () => {
        const { onClose } = this.props;
        onClose();
    }

    render() {
        const { withdraw, ln } = this.props;
        const { currency, nextStep, tx } = withdraw;
<<<<<<< HEAD
        const {ln} = this.props;
const copy = CopyText.affiliateWithdrawFormWithdraw[ln];
=======
        const copy = CopyText.affiliateWithdrawForm[ln];
>>>>>>> d4401dd52d36b5369975f2fc89cb4e032a134ed4

        return (
            <div styleName='root'>
                 <div styleName="deposit">
                    <div styleName="title">
                        <HorizontalStepper 
                            showStepper={false}
                            nextStep={nextStep}
                            steps={[
                                {
<<<<<<< HEAD
                                    label : copy.WITHDRAW.HORIZONTAL_STEPPER.LABEL[0],
                                    title : copy.WITHDRAW.HORIZONTAL_STEPPER.TITLE[0],
=======
                                    label : copy.HORIZONTAL_STEPPER.STEPS[0].LABEL,
                                    title : copy.HORIZONTAL_STEPPER.STEPS[0].TITLE,
>>>>>>> d4401dd52d36b5369975f2fc89cb4e032a134ed4
                                    condition : (currency != ''),
                                    content : <CurrencyWithdrawForm/>
                                },
                                {
<<<<<<< HEAD
                                    label : copy.WITHDRAW.HORIZONTAL_STEPPER.LABEL[1],
                                    title : copy.WITHDRAW.HORIZONTAL_STEPPER.TITLE[1],
=======
                                    label : copy.HORIZONTAL_STEPPER.STEPS[1].LABEL,
                                    title : copy.HORIZONTAL_STEPPER.STEPS[1].TITLE,
>>>>>>> d4401dd52d36b5369975f2fc89cb4e032a134ed4
                                    condition : (tx && tx != ''),
                                    content : <WithdrawForm/>,
                                    last : true,
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
