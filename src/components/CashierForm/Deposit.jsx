import React, { Component } from "react";
// eslint-disable-next-line import/no-cycle
import "./index.css";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import { promptMetamask } from 'lib/metamask';
import { MetamaskPrompt, DepositConfirmForm, AmountDepositForm, CurrencyDepositForm, HorizontalStepper, DepositForm, InformationBox } from 'components';
import { getMetamaskAccount } from "../../lib/metamask";

const defaultProps = {
    amount : 1,
    ticker : 'N/A',
    deposits : [],
    hasMetamask : true
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
        try{
            await promptMetamask();
            this.setState({...this.state, hasMetamask : true})
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
        const { hasMetamask } = this.state;
        const { currency, nextStep, amount, tx, isConfirmed } = deposit;

        if(!hasMetamask){return (<MetamaskPrompt hasMetamask={hasMetamask}/>)}

        return (
            <div styleName='root'>
                <div styleName="deposit">
                    <div styleName="title">
                        {/*<InformationBox type={'info'} message={'If you left open deposits please finish the process at the "Profile" Tab under "Cashier" or continue here'} image={info}/> */}
                        <HorizontalStepper 
                            showStepper={false}
                            nextStep={nextStep}
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
                                    label : "Deposit",
                                    title : 'Deposit your Tokens',
                                    condition : (tx && tx != ''),
                                    pass : (tx && tx != ''),
                                    content : <DepositForm/>
                                },
                                {
                                    label : "Confirm",
                                    condition : (isConfirmed),
                                    content : <DepositConfirmForm onClose={this.closeDeposit}/>,
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
        ln : state.language,
        currency : state.currency
    };
}

export default compose(connect(mapStateToProps))(Deposit);
