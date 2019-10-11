import React, { Component } from "react";
// eslint-disable-next-line import/no-cycle
import "./index.css";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import { promptMetamask } from 'lib/metamask';
import { 
    MetamaskPrompt, HorizontalStepper, AmountWithdrawForm, CurrencyWithdrawForm, 
    WithdrawForm
} from 'components';
import { getMetamaskAccount } from "../../lib/metamask";
import { MIN_WITHDRAWAL } from "../../lib/api/apiConfig";
import { Numbers } from 'lib/ethereum/lib';
import store from "../../containers/App/store";
import { setWithdrawInfo } from "../../redux/actions/withdraw";

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
            await promptMetamask();
            let userAddress = profile.getAddress();
            let address = await getMetamaskAccount();
            let isValidAddress = new String(userAddress).toLowerCase() == new String(address).toLowerCase();
            let allowedAmount = await profile.getApprovedWithdrawAsync();
            const { wallet : userBalance } = profile.getAffiliateInfo();
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
        const { hasMetamask, isValidAddress } = this.state;
        const { currency, nextStep, tx } = withdraw;
        if(!hasMetamask){return (<MetamaskPrompt hasMetamask={hasMetamask}/>)}

        return (
            <div styleName='root'>
                 <div styleName="deposit">
                    <div styleName="title">
                        <HorizontalStepper 
                            showStepper={false}
                            nextStep={nextStep}
                            alertCondition={!isValidAddress}
                            alertMessage={`This address is not set with this user, please change to your address`}
                            steps={[
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
