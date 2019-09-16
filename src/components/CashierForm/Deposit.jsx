import React, { Component } from "react";
// eslint-disable-next-line import/no-cycle
import "./index.css";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import { promptMetamask } from 'lib/metamask';
import { MetamaskPrompt, DepositConfirmForm, AmountDepositForm, CurrencyDepositForm, HorizontalStepper, DepositForm, InformationBox } from 'components';
import { TradeFormDexDeposit } from "../TradeForms/Dex";
import { getMetamaskAccount } from "../../lib/metamask";
import info from 'assets/info.png';

const defaultProps = {
    amount : 10,
    ticker : 'DAI',
    isAddressValid : true,
    deposits : [],
    hasMetamask : true,
    ownedDAI : 0,
    isValidAddress : true
}

class Deposit extends Component {

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
            let ownedDAI = parseFloat(await profile.getTokenAmount());
            this.setState({...this.state, hasMetamask : true, ownedDAI, isValidAddress})
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
        const { deposit } = this.props;
        const { hasMetamask, ownedDAI, isValidAddress } = this.state;
        const { currency, nextStep, amount, tx, isConfirmed } = deposit;

        if(!hasMetamask){return (<MetamaskPrompt hasMetamask={hasMetamask}/>)}

        return (
            <div styleName='root'>
                <div styleName="deposit">
                    <div styleName="title">
                        <InformationBox type={'info'} message={'If you left open deposits please finish the process at the "Profile" Tab under "CashierForm"'} image={info}/>
                        <HorizontalStepper 
                            nextStep={nextStep}
                            alertCondition={!isValidAddress}
                            alertMessage={`This address is not set with this user, please change to your address`}
                            steps={[
                                {
                                    label : "Choose",
                                    title : 'Pick the Currency you have',
                                    condition : (currency != ''),
                                    content : <CurrencyDepositForm/>
                                },
                                {
                                    label : "Amount",
                                    title : 'How much you want to deposit?',
                                    condition : (amount >= 0.1),
                                    content : <AmountDepositForm/>
                                },
                                {
                                    label : "Trade",
                                    title : 'Trade your tokens seamlessly',
                                    condition : (parseFloat(ownedDAI) >= parseFloat(deposit.amount)),
                                    pass : (new String(currency).toLowerCase() == 'dai'),
                                    content : <TradeFormDexDeposit/>
                                },
                                {
                                    label : "Deposit",
                                    title : 'Deposit your Tokens',
                                    condition : (tx && tx != ''),
                                    content : <DepositForm/>
                                },
                                {
                                    label : "Confirm",
                                    condition : (isConfirmed),
                                    content : <DepositConfirmForm/>,
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
        deposit : state.deposit,
        profile : state.profile,
        ln : state.language
    };
}

export default compose(connect(mapStateToProps))(Deposit);
