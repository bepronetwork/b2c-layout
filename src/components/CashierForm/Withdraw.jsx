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
import _ from 'lodash';

const defaultProps = {
    amount : 1,
    ticker : 'N/A',
    deposits : [],
    hasMetamask : true,
    mounted : false,
    address : '0x'
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
        const address = await getMetamaskAccount();
        const { currency } = withdraw;
        let userBalance = profile.getBalance(currency);
        this.setState({...this.state, userBalance, address});
    }

    closeDeposit = () => {
        const { onClose } = this.props;
        onClose();
    }

    render() {
        const { withdraw } = this.props;
        const { userBalance, address } = this.state;
        const { currency, nextStep, amount, tx, _id } = withdraw;

        return (
            <div styleName='root'>
                 <div styleName="deposit">
                    <div styleName="title">
                        <InformationBox type={'info'} message={`This withdraw will be made to the current address you are using via the installed wallet ${address}`} image={info}/>
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
                                    condition : ( (amount >= 0.0001)  && (amount <= parseFloat(userBalance)) ),
                                    content : <AmountWithdrawForm/>
                                },
                                {
                                    label : "Withdraw",
                                    title : 'Withdraw',
                                    condition : (_id && (_id != ('' || null))),
                                    content : <WithdrawForm closeStepper={this.closeDeposit}/>,
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
