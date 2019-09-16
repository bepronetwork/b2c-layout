import React, { Component } from "react";
// eslint-disable-next-line import/no-cycle
import "./index.css";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import { promptMetamask } from 'lib/metamask';
import { 
    MetamaskPrompt, HorizontalStepper, AmountWithdrawForm, CurrencyWithdrawForm, 
    WithdrawForm, WithdrawConfirmForm, TradeFormDexWithdraw, InformationBox
} from 'components';
import { getMetamaskAccount } from "../../lib/metamask";
import { MIN_WITHDRAWAL } from "../../lib/api/apiConfig";
import { Numbers } from 'lib/ethereum/lib';
import info from 'assets/info.png';

const defaultProps = {
    amount : 10,
    ticker : 'DAI',
    isAddressValid : true,
    deposits : [],
    hasMetamask : true,
    ownedDAI : 0,
    isValidAddress : true,
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
        const { profile } = props;
        try{
            await promptMetamask();
            let userAddress = profile.getAddress();
            let address = await getMetamaskAccount();
            let isValidAddress = new String(userAddress).toLowerCase() == new String(address).toLowerCase();
            let allowedAmount = await profile.getApprovedWithdrawAsync();
            let userBalance = profile.getBalance();
            let ownedDAI = parseFloat(await profile.getTokenAmount());
            let maxWithdrawal = await profile.getContract().getMaxWithdrawal();
            this.setState({...this.state, hasMetamask : true, ownedDAI, userBalance, maxWithdrawal, allowedAmount, isValidAddress});
        }catch(err){
            // Metamask is Closed or not Installed
            this.setState({...this.state, hasMetamask : false})
        }
    }

    closeDeposit = () => {
        const { onClose } = this.props;
        onClose();
    }

    render() {
        const { withdraw } = this.props;
        const { hasMetamask, maxWithdrawal, userBalance, allowedAmount, isValidAddress } = this.state;
        const { currency, nextStep, amount, tx, isConfirmed } = withdraw;
        if(!hasMetamask){return (<MetamaskPrompt hasMetamask={hasMetamask}/>)}

        return (
            <div styleName='root'>
                 <div styleName="deposit">
                    <div styleName="title">
                        <InformationBox type={'info'} message={'If you left open withdraws please finish the process at the "Profile" Tab under "CashierForm"'} image={info}/>
                        <HorizontalStepper 
                            nextStep={nextStep}
                            alertCondition={!isValidAddress}
                            alertMessage={`This address is not set with this user, please change to your address`}
                            steps={[
                                {
                                    label : "Amount",
                                    title : 'How much you want to withdraw?',
                                    condition : (  (amount >= 0.01) && ( ((amount <= Numbers.toFloat(userBalance)) && (amount <= maxWithdrawal) && (amount >= MIN_WITHDRAWAL)) || (allowedAmount >= amount)) ),
                                    content : <AmountWithdrawForm/>
                                },
                         
                                {
                                    label : "Choose",
                                    title : 'Choose the Currency you want to withdraw to',
                                    condition : (currency != ''),
                                    content : <CurrencyWithdrawForm/>
                                },
                                {
                                    label : "Withdraw",
                                    title : 'Withdraw',
                                    condition : (tx && tx != ''),
                                    content : <WithdrawForm/>
                                },
                                /*{
                                    label : "Trade",
                                    title : 'Trade your tokens seamlessly',
                                    pass : (new String(currency).toLowerCase() == 'dai'),
                                    content : <TradeFormDexWithdraw/>
                                },*/
                                {
                                    label : "Confirm",
                                    condition : isConfirmed,
                                    content : <WithdrawConfirmForm/>,
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
